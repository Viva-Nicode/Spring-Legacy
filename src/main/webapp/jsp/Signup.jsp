<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"
	isELIgnored="false"%>
<!DOCTYPE html>
<html>
<head>
	<Title> Signup Page </Title>
	<link rel="stylesheet" href="../static/css/Signup.css">
	<link rel="stylesheet" href="../static/css/bootstrap.min.css">
	<link rel="stylesheet" href="../static/css/custom.css">
	<script src="../static/js/jquery-3.6.0.min.js"></script>
	<script src="../static/js/bootstrap.min.js"></script>
	<script src="../static/js/popper.js"></script>
	<script src="../static/js/popper.js.map"></script>
	<script>
	function showAlert(){
		$('#alert').show()
		setTimeout(() => { $('#alert').fadeOut() }, 3000);
		return false;
	}

	function doValidation() {
		const form = document.signupForm;
		const id = form.User_ID.value;
		const pw = form.User_PW.value;
		const nickname = form.nickname.value;
		const domainInput = form.domain.value;
		const domainOption = document.getElementById("domainOption");
		
		const noEngRule = /^[a-zA-Z0-9]*$/;
		const regEmail = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
		
		let lastDomain;

		const il = id.length;
		const pl = pw.length;
		const nl = nickname.length;
		
		if(domainOption.value === "Direct_input")
			lastDomain = domainInput;
		else if(domainOption.value != "Direct_input")
			lastDomain = domainInput + domainOption.value;
		
		if(il <= 8 || 17 <= il){
			$('#errorMsg').html('ID length must be 9 ~ 16');
			return showAlert();
		}else if(pl <= 11 || 21 <= pl){
			$('#errorMsg').html('PW length must be 12 ~ 20');
			return showAlert();
		}else if(nl <= 5 || 17 <= nl){
			$('#errorMsg').html('nickname length must be 6 ~ 16');
			return showAlert();
		}else if(!noEngRule.test(id) || !noEngRule.test(nickname)){
			$('#errorMsg').html('The ID, nickname must consist of numbers and English only.');
			return showAlert();
		}else if(!regEmail.test(lastDomain)){
			$('#errorMsg').html('wrong Email type');
			return showAlert();
		}else{
			$.ajax({
				type:"post",
				async: false,
				url: "http://${applicationScope.ip}:8080/MemberController/checkSignupOverlap.do",
				data: {user_id : id, user_name: nickname, email : lastDomain, user_pw : pw},
				success: function (data, textStatus){
					if(data == 0){
						location.href = '../index.jsp';
					}else if(data == 1){
						$('#errorMsg').html('id exist already');
						return showAlert();
					}else if(data == 2){
						$('#errorMsg').html('nickname exist already');
						return showAlert();
					}else if(data == 3){
						$('#errorMsg').html('email exist already');
						return showAlert();
					}
					return false;
				},
				error : function (request, status, error){
					alert("code: " + request.status + "message: " + request.responseText + "error: " + error);
				},
				complete: function (data, textStatus){}
			});
		}
	}
</script>
</head>

<body>
	<img id="backgroundimage" src="../456.jpg">
	<div id="signupForm">
		<form method="post" name="signupForm" onsubmit="return doValidation()">
			<fieldset style="width: 270px">
				<legend>
					<font color="#3D18E0">Sign Up Form</font>
				</legend>
				<div style="color: #1B27DE;" style="text-align:left;">ID</div>
				<input type="text" name="User_ID" required autofocus style="text-align: left"><br> <br>
				
				<div style="color: #1B27DE;" style="text-align:left;">PW</div>
				<input type="password" name="User_PW" required> <br> <br>
				
				<div style="color: #1B27DE;" style="text-align:left;">nickname</div>
				<input type="text" name="nickname" required><br><br>
				
				<div style="color: #1B27DE;" style="text-align:left;">domainName</div>
				<input type="text" name="domain" required>
				<select name="domainName" id="domainOption">
					<option value="Direct_input">@Direct input</option>
					<option value="@naver.com">@naver.com</option>
					<option value="@gmail.com">@gmail.com</option>
				</select><br>
				<hr>
				<input class="btn btn-success" type="button" onclick="doValidation()" value="sign Up">&nbsp;&nbsp;
				<input class="btn btn-primary" value="Back" onclick="location.href='http://${applicationScope.ip}:8080';" >
			</fieldset>
		</form>
	</div>
		<div id="alert" class="alert alert-danger alert-dismissable fade in" style="display: none;">
			<svg id ="svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
				fill="currentColor"
				class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2"
				viewBox="0 0 16 16" role="img" aria-label="Warning:">
    			<path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
  			</svg>
			<h4>Notification</h4>
			<div id="errorMsg"></div>
		</div>

</body>

</html>

<!-- id 속성은 body안에서 고유해야 함 -->
<!-- class 는 중복 가능함 -->
<!-- h1은 기본이 32px이고 굵기 즉 font-weight는 900이다. -->
<!-- div같은 태그나 그냥 일반 문자열은 16px이 기본이다. -->


<!-- 아래가 h1의 기본 속성들인데  -->
<!-- h1 {
    display: block;
    font-size: 2em;
    margin-block-start: 0.67em;
    margin-block-end: 0.67em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
}

보면 폰트의 크기가 2em으로 되어있는 것을 볼수있는데 이는 바로 상위요소(여기선 body가 된다.)의 두배로 폰트 사이즈를 지정하겠다는 의미가 된다
즉 body의 폰트 사이즈를 10으로 하면 body안에 있는 h1의 폰트 사이즈는 두배인 20이 된다.

하지만 body의 폰트사이즈를 명시하지 않는다면 body의 기본 폰트 사이즈인 16의 두배인 32가 되는 것이다.

rem은 자신을 포함하고 있는 최상위 태그 즉 html 태그의 상대적인 배수 크기를 지정한다.
rem을 사용한다면 최상위 태그인 html에 기반한 상대적인 배수 크기로 지정되므로 그중간에 잇는 body태그 같은건 영향을 미치지 않는다고 한다. -->