function install() {
    echo Install $1
    pushd $1
    npm install
    if [ $2 ]; then npm run test; fi
    popd
}

(
    set -e
    install Chatdown with_test
    install Dispatch
    install Ludown with_test
    install LUIS with_test
    install LUISGen
    install MSBot
    install QnAMaker with_test
)

errorcode=$?
if [ $errorcode -ne 0 ]; then
  echo exiting with errorcode $errorcode
  exit $errorcode
fi
