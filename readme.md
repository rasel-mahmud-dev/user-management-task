
## Multi Role and Permission based User management API\

#### Repository: https://github.com/rasel-mahmud-dev/user-management-task.git

### Features
- Multiples role and dynamic permission
- Forgot password
- Reset password
- Account verification via EMAIL OTP Code.
- LOGIN/Registration
- Bulk user import (For admin role)
- create permission (For admin role)
- csurf protection
- Session based secure authentication
- user management CRUD based on permission


#### Roles
- ADMIN
- SUPPORT
- USER


Each role has 4 typeof permission.
But ONLY admin has every route access

#### Permission
- read
- create
- update
- delete


#### You can import this postman collection to test all route endpoint <br/>  
[prisma-node-task.postman_collection.json](prisma-node-task.postman_collection.json)


## To run project

Step 1, first install npm modules 

```shell
npm install 
```

Step 2, Generate types and database migration
```shell
npx prisma init 
npx prisma migrate dev
```

Step 3, Get a CSRF token using postman
hit root server url and it send a response with CSRF token
```shell
{
    "message": "Your csurf token",
    "token": "678a58fb-4392-4c38-a0e3-cb850a2822f0"
}
```


Step 4, Now Create an account

```shell
URL is BASE URL

POST {{URL}}/api/auth/registration
send body as json 
{
    "name": "rasel mahmud",
    "email": "rasel@gmail.com",
    "password": "123",
    "_csrf": "678a58fb-4392-4c38-a0e3-cb850a2822f0" // replace your csurf token
}
```

Step 5, Verify you an account via OTP Code
when you create account, An OTP code has send your gmail.
```shell

POST {{URL}}/api/auth/verify-account
body data as json
{
    "email": "rasel@gmail.com",
    "pin": "401452", // replace your otp
    "_csrf": "678a58fb-4392-4c38-a0e3-cb850a2822f0" // replace your csurf token
}

response back like this.
{
    "message": "Account has been verifiyed"
}

```


Step 6, Login your an account
```shell

POST {{URL}}/api/auth/login
body data as json
{
    "email": "rasel@gmail.com",
    "password": "12345", // replace your otp
    "_csrf": "678a58fb-4392-4c38-a0e3-cb850a2822f0" // replace your csurf token
}

response back like this.
{
     "user": {
        "id": 39,
        "email": "manuall3@gmail.com",
        "role": "USER",
        "password": "",
        "isVerified": true
    },
    "isSendVerificationCode": false,
    "message": ""
}

```

### Some route
Get all Uses
```shell
GET {{URL}}/api/users [LOGIN Required]
response
{
    "users": [
        {
            "id": 2,
            "name": "test",
            "email": "test@gmail.com",
            "role": "SUPPORT",
            "createdAt": "2023-06-06T04:34:59.234Z",
            "isVerified": true
        },
        {...},
        {...},
        {...},
        ...
    ]
}
```


Forgot password
```shell
POST {{URL}}/api/auth/forgot-password
body
{
    "email": "raselmr005@gmail.com",
    "_csrf": "678a58fb-4392-4c38-a0e3-cb850a2822f0" // replace your csurf token
}
response 
{
    "message": "Please check your email to reset password"
}
It will send a mail with a password reset pin
```


Reset password
```shell
POST {{URL}}/api/auth/reset-password
body
{
 {
    "email": "raselmr005@gmail.com",
    "pin": "137585",
    "newPassword": "12345", 
    "confirmPassword": "12345"
}
    "_csrf": "678a58fb-4392-4c38-a0e3-cb850a2822f0" // replace your csurf token
}
response 
It will reset password and store your information into session [logged]
```



Create permission
```shell

POST {{URL}}/api/permission/create  [ADMIN ROLE]

body 
{
    "permissions": [
        {
            "role": "ADMIN",
            "read": true,
            "create": true,
            "update": true,
            "delete": true
        },
        {
            "role": "SUPPORT",
            "read": true,
            "create": true,
            "update": true,
            "delete": true
        },
        {
            "role": "USER",
            "read": true,
            "create": false,
            "update": false,
            "delete": false
        }
    ]
}

```


## ALL API ENDPOINT

### Permission route
create  permission for admin user \
POST /api/permission/create

### Users route
get all users  \
GET /api/users requiredAuth, checkPermission({read: true})

create user  \
POST /api/users/create requiredAuth, checkPermission({create: true})

Update user  \
PATCH /api/users/update/:userId  requiredAuth, checkPermission({update: true}), updateUser)

Delete User  \
DELETE /api/users/delete/:userId  requiredAuth, checkPermission({delete: true}), deleteUser)

### Auth route
// login user  \
POST /api/auth/login

// user registration  \
POST /api/auth/registration

// user registration  \
GET /api/auth/auth-info", requiredAuth, getAuthInfo)

// bulk user registration for admin role  \
POST /api/auth/bulk-registration", requiredAdmin

// logout user  \
GET /api/auth/logout

// after creating user account. this route make user verify via OTP code.  \
POST /api/auth/verify-account

// get otp/pin code for reset password via user email  \
POST /api/auth/forgot-password

// reset password using otp pin code  \
POST /api/auth/reset-password
