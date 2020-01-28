LIST="$(sfdx force:org:list --json)"
URLS=$(echo $LIST | jq -r '.result.scratchOrgs[] | .instanceUrl + if .isDefaultUsername then "<---" else "" end')

select OPT in ${URLS[@]}
do
  QUERY=".result.scratchOrgs[] | select(.instanceUrl == \"${OPT[@]}\") | .username"
  USER=$(echo $LIST | jq -r "$QUERY")
  if [ -n "$OPT" ]; then
    sfdx force:config:set defaultusername=$USER
    sfdx force:org:open
  fi
  break
done
