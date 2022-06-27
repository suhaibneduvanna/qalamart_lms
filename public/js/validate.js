function validate_password(CnfPassword) {
    let password = document.getElementById('password').value;
    let errorSpan = document.getElementById('error');
    let SignUpBt = document.getElementById('signupbt');

    if (CnfPassword != null) {
      if (password == CnfPassword) {
        errorSpan.style.display = 'none';
        SignUpBt.disabled = false

      } else {
        SignUpBt.disabled = true

        errorSpan.style.display = 'inline';
      }
    } else {

    }

  }

  function validate_password1(password) {
    let CnfPassword = document.getElementById('cnfPass').value;
    let SignUpBt = document.getElementById('signupbt');
    let errorSpan = document.getElementById('error');

    if (CnfPassword != null) {
      if (password == CnfPassword) {
        errorSpan.style.display = 'none';
        SignUpBt.disabled = false

      } else {
        SignUpBt.disabled = true
        errorSpan.style.display = 'inline';
      }
    } else {

    }

  }

  function validate_field(data) {
    let SignUpBt = document.getElementById('signupbt');

    if (data != null) {
      SignUpBt.disabled = false
    } else {
      SignUpBt.disabled = true

    }
  }