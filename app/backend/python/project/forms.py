from django import forms

class SettingsForm(forms.Form):
    # enableApp = ...
    starthour = forms.IntegerField(label='Start Hour', min_value=0, max_value=23)
    finishhour = forms.IntegerField(label='Finish Hour', min_value=0, max_value=23)
    utcoffset = forms.IntegerField(label='UTC Time Offset', min_value=-12, max_value=14, required=False)
    # noreply = ...
    # starmsg = ...
    ccemailadr = forms.EmailField(label='Cc Email Address(es)', max_length=1000, required=False)
    bccemailadr = forms.EmailField(label='Bcc Email Address(es)', max_length=1000, required=False)
    msgbody = forms.CharField(label='Message Body', max_length=5000)

    def clean(self):
        form_data = self.cleaned_data

        if {'starthour', 'finishhour'} <= set(form_data) and form_data['starthour'] == form_data['finishhour']:
            self._errors["finishhour"] = ["Finish hour can not be equal to start hour."]
            del form_data['finishhour']

        return form_data