from django import forms

class GmailAutoResponderSettings(forms.Form):
    enableApp = forms.BooleanField(label='Enable Gmail AutoResponder')
    starthour = forms.TimeField(label='Start Hour')
    finishhour = forms.TimeField(label='Finish Hour')
    dstoffset = forms.IntegerField(label='Daylight Saving Time Offset')
    ccemailadr = forms.EmailField(label='Cc Email Address(es)', max_length=1000)
    bccemailadr = forms.EmailField(label='Bcc Email Address(es)', max_length=1000)
    noreply = forms.NullBooleanField(label='Reply with "noreply" address?')
    starmsg = forms.BooleanField(label='Star processed messages in Gmail?')
    msgbody = forms.CharField(label='Message Body', widget=forms.Textarea())