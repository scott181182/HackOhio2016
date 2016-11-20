source="./payload.zip"
target="./payload-sh.zip"

STARTTIME=$(date +%s)

cp "./payload0.zip" "./payload0-sh.zip"
cp "./payload1.zip" "./payload1-sh.zip"
cp "./payload2.zip" "./payload2-sh.zip"
cp "./payload3.zip" "./payload3-sh.zip"

ENDTIME=$(date +%s)
echo "It takes $($ENDTIME-$STARTTIME) seconds to complete this task..."