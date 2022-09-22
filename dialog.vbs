Set objArgs = WScript.Arguments
messageText = objArgs(0)
messageType = objArgs(1)
messageTitle = objArgs(2)
retValue = MsgBox(messageText, messageType, messageTitle)
WScript.StdOut.Write retValue
WScript.Quit(0)