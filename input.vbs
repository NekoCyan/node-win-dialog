Dim retValue, msgText, msgTitle, msgTextDefault, xPos, yPos
retValue = 0
Set objArgs = WScript.Arguments
length = WScript.Arguments.Length
If length = 1 Then
    msgText = objArgs(0)
    retValue=Inputbox(msgText)
End If
If length = 2 Then
    msgText = objArgs(0)
    msgTitle = objArgs(1)
    retValue=Inputbox(msgText,msgTitle)
End If
If length = 3 Then
    msgText = objArgs(0)
    msgTitle = objArgs(1)
    msgTextDefault = objArgs(2)
    retValue=Inputbox(msgText,msgTitle,msgTextDefault)
End If
If length = 4 Then
    msgText = objArgs(0)
    msgTitle = objArgs(1)
    msgTextDefault = objArgs(2)
    xPos = objArgs(3)
    retValue=Inputbox(msgText,msgTitle,msgTextDefault,xPos)
End If
If length = 5 Then
    msgText = objArgs(0)
    msgTitle = objArgs(1)
    msgTextDefault = objArgs(2)
    xPos = objArgs(3)
    yPos = objArgs(4)
    retValue=Inputbox(msgText,msgTitle,msgTextDefault,xPos,yPos)
End If
WScript.StdOut.Write retValue
WScript.Quit(0)