#!/bin/bash

bashScriptsDir="$(dirname "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")")";
# shellcheck disable=SC1091
source "${bashScriptsDir}/environments/dev.sh";

if (prisma migrate status); then
    exit 0;
else
    prisma migrate dev;
    # sleep cause prisma is so finnicky
    sleep 1s;
    ts-node ./src/seeding/seed-from-nothing.ts 2> /dev/null;
fi
