from django import forms

class TestSettingsForm(forms.Form):
    enableApp = forms.BooleanField(label='Enable Gmail AutoResponder')
    starthour = forms.TimeField(label='Start Hour')
    finishhour = forms.TimeField(label='Finish Hour')
    dstoffset = forms.IntegerField(label='Daylight Saving Time Offset')
    noreply = forms.NullBooleanField(label='Reply with "noreply" address?')
    starmsg = forms.BooleanField(label='Star processed messages in Gmail?')
    #msgbody = forms.CharField(label='Message Body', widget=forms.Textarea())
    

    # User-defined validation method
    def clean_msgbody(self):
        data = self.cleaned_data['msgbody']
        # Validate 'data'...
        return data


# Test class
class SettingsForm(forms.Form):
    #testScriptUserPty = forms.CharField(label='Test Script User Property', max_length=10)
    #testScriptUserPty2 = forms.CharField(label='Test Script User Property 2', max_length=10)
    ccemailadr = forms.EmailField(label='Cc Email Address(es)', max_length=1000)
    bccemailadr = forms.EmailField(label='Bcc Email Address(es)', max_length=1000)
    msgbody = forms.CharField(label='Message Body', max_length=5000)



# ----------------------------
#data = {'key': 'value'}
#f = GmailAutoResponderSettings(data)
#f.is_valid()
#f.cleaned_data