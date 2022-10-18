#!/bin/bash

bashScriptsDir="$(dirname "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")")";
# shellcheck disable=SC1091
source "${bashScriptsDir}/environments/dev.sh";

set -e;

npx prisma migrate status;