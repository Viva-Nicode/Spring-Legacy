<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" 
isELIgnored="false"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%
	String returnPath = request.getParameter("returnPath");
%>
<script>
	function showAlert(){
		$('#alert').show()
		setTimeout(() => { $('#alert').fadeOut() }, 3000);
		return false;
	}

	function checkLoginFail(){
		const user_id = $('#user_id').val();
		const user_pw = $('#user_pw').val();
		console.log(user_id);
		/*
		document.getElementById() 이거랑 var userEmailInput = $('#user_email'); 이거가 가져오는것은 값 자체가 아닌 태그이다.
		마찬가지로 form.User_ID 가 가져오는것도 값 자체가 아니므로 .value를 붙여줘야 값을 가져온다.
		*/
		$.ajax({
			type:"post",
			async: false,
			url: "http://${applicationScope.ip}:8080/MemberController/Login.do",
			data: {user_id : user_id, user_pw : user_pw},
			success: function (data, textStatus){
				if(data == 0){
					$('#myModal').modal('hide');
					location.href='http://${applicationScope.ip}:8080<%=returnPath%>';
				}else{
					console.log('login fail');
					$('#errorMsg').html('wrong id or pw');
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
</script>
<div class="modal" tabindex="-1" id="myModal">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 id="modalMsg" class="modal-title">Login and Join!</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
			<form name="loginForm" id="loginform">
			<fieldset style="width: 270px">
				<legend>
					<font color="black">sign in form</font>
				</legend>
				<div style="color: blueviolet;" style="text-align:left;">ID</div>
				<input id="user_id" type="text" name="User_ID" required autofocus style="text-align: left"><br> <br>
				<div style="color: blueviolet;" style="text-align:left;">PW</div>
				<input id="user_pw" type="password" name="User_PW" required> <br> <br>
				<hr>
			</fieldset>
		</form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" onclick="checkLoginFail()">login</button>
      </div>
    </div>
  </div>

<div id="alert" role="alert" class="alert alert-danger alert-dismissable fade show" style="display: none;">
	<svg id ="svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
		fill="currentColor"
		class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2"
		viewBox="0 0 16 16" role="img" aria-label="Warning:">
    	<path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
  	</svg>
	<h4>Notification</h4>
	<div id="errorMsg"></div>
</div>
</div>