#!/bin/bash
set -x
curl -u admin:admin -X POST -F action="clear" -F path="/content/phonegap/brucelefebvre/content/kitchen-sink/kitchen-sink-content-sync" -F "_charset_"="utf-8" http://localhost:4502/libs/cq/contentsync/console/configs.json
curl -u admin:admin -X POST -F action="update" -F path="/content/phonegap/brucelefebvre/content/kitchen-sink/kitchen-sink-content-sync" -F "_charset_"="utf-8" http://localhost:4502/libs/cq/contentsync/console/configs.json
