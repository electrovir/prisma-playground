#!/bin/bash

set -e;

bashScriptsDir="$(dirname "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")")";
# shellcheck disable=SC1091
source "${bashScriptsDir}/environments/dev.sh";

rm -rf prisma/database;
rm -rf prisma/database/migrations;
prisma migrate dev --name init;
ts-node ./src/seeding/seed-from-nothing.ts;
