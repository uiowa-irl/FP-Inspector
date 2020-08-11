REM #!/usr/bin/env bash

REM # This script facilitate starting a shell / running tests
REM # within the Docker environment on Windows
REM #
REM # Usage: ./run-on-windows-via-docker.sh <optional-command-to-run>
REM #
REM # If <optional-command-to-run> is left out, an interactive
REM # shell within the Docker environment is initiated

REM # remove artifacts from locally run tests if any (or else
REM # we will run into a ImportMismatchError)

DEL /s /f .pytest_cache/
DEL /s /f test/__pycache__/

REM # allow access to XQuarts for the current IP
REM export IP=$(ifconfig en0 | grep inet | awk '$1=="inet" {print $2}')
REM xhost + $IP
REM export DISPLAY=$IP:0

REM # start the docker environment with X server forwarding
IF "%~1" == "" (ECHO "Starting a shell in the Docker environment") ELSE (ECHO "Running '%*' in the Docker environment")
docker run -v %cd%/docker-volume:/home/user/Desktop/ -it openwpm %*
