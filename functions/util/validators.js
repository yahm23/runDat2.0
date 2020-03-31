//Checking methods:
const emailValidCheck=(email)=>{
    const regEmailExpression =  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(email.match(regEmailExpression)) return true;
    else return false;
}

const emptyCheck=(input)=>{
    if(input.trim()===''){return true}
    else{return false}
}

exports.validateSignUpData = (newUser )=>{
      //Checking input of new user 
      let errors = {};


      if(emptyCheck(newUser.email)){
          errors.email = 'Email must not be empty';
      } else if(!emailValidCheck(newUser.email)){
          errors.email = 'Must be a valid email address';
      }
      if(emptyCheck(newUser.password)) errors.password='Password must not be empty';
      if(newUser.password !== newUser.confirmPassword) errors.confirmPassword = 'Passwords must match';
      if(emptyCheck(newUser.userName)) errors.userName='User Name must not be emmpty';
  
      return {
          errors,
          valid: Object.keys(errors).length ==0? true:false
      }
  
}

exports.validateLoginData = (user)=>{
    let errors={};
    if(emptyCheck(user.email)) errors.email = 'Email must not be empty';
    if(emptyCheck(user.password))errors.password = ' password must not be empty';
    return {
        errors,
        valid: Object.keys(errors).length ==0? true:false
    }
}

exports.reduceUserDetails = (data)=>{
    let userDetails = {}
    if(data.bio) userDetails.bio = data.bio;
    if(data.social) {
        if(data.social.trim().substring(0,4) !== 'http'){
            userDetails.social=`http://${data.social.trim()}`;
        } else userDetails.social = data.social;
    };
    if(data.location) userDetails.location = data.location;
    console.log(userDetails);
    // console.log(data.website);
    return userDetails;
}