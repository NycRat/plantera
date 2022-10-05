use http_auth_basic::Credentials;
use rocket::http::Status;
use rocket::request::{FromRequest, Outcome};
use rocket::Request;

#[derive(Debug)]
pub enum AuthenticationStatus {
    Valid,
    NoAuthentication,
    PasswordTooShort,
    UsernameTooShort,
    UsernameTooLong,
    UsernameInvalid,
}

fn outcome_shortcut(
    status: AuthenticationStatus,
    credentials: Option<Credentials>,
) -> Outcome<Authentication, ()> {
    return Outcome::Success(Authentication(status, credentials));
}

pub struct Authentication(pub AuthenticationStatus, pub Option<Credentials>);

#[rocket::async_trait]
impl<'r> FromRequest<'r> for Authentication {
    type Error = ();

    async fn from_request(request: &'r Request<'_>) -> Outcome<Self, Self::Error> {
        use AuthenticationStatus::*;
        let auth = request.headers().get_one("Authorization");
        if let Some(encoded_credentials) = auth {
            match Credentials::from_header(encoded_credentials.into()) {
                Ok(mut decoded_credentials) => {
                    decoded_credentials.user_id = decoded_credentials.user_id.trim().to_owned();
                    decoded_credentials.password = decoded_credentials.password.trim().to_owned();

                    if decoded_credentials.password.len() < 10 {
                        return outcome_shortcut(PasswordTooShort, None);
                    }
                    if decoded_credentials.user_id.len() < 3 {
                        return outcome_shortcut(UsernameTooShort, None);
                    }
                    if decoded_credentials.user_id.len() > 100 {
                        return outcome_shortcut(UsernameTooLong, None);
                    }
                    if !decoded_credentials
                        .user_id
                        .chars()
                        .all(|c| (c.is_ascii() && c.is_alphanumeric()) || c == '_' || c == '.')
                    {
                        return outcome_shortcut(UsernameInvalid, None);
                    }

                    return outcome_shortcut(Valid, Some(decoded_credentials));
                }
                Err(err) => println!("{:?}", err),
            }
        } else {
            return outcome_shortcut(NoAuthentication, None);
        }

        return Outcome::Failure((Status::InternalServerError, ()));
    }
}

pub struct TokenAuthentication(pub Option<String>);

#[rocket::async_trait]
impl<'r> FromRequest<'r> for TokenAuthentication {
    type Error = ();

    async fn from_request(request: &'r Request<'_>) -> Outcome<Self, Self::Error> {
        let token_cookie = request.cookies().get("token");
        if let Some(token_cookie) = token_cookie {
            return Outcome::Success(TokenAuthentication(Some(token_cookie.value().into())));
        }
        return Outcome::Success(TokenAuthentication(None));
    }
}
