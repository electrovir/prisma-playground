#!/bin/bash

set -e;

bashScriptsDir="$(dirname "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")")";
# shellcheck disable=SC1091
source "${bashScriptsDir}/environments/dev.sh";

prisma migrate dev;

set +e;

ts-node ./src/seeding/seed-from-nothing.ts 2> /dev/null;
