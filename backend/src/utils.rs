use http_auth_basic::Credentials;
use mysql::{prelude::Queryable, PooledConn};

pub fn is_authorized(conn: &mut PooledConn, credentials: &Credentials) -> bool {
    let user: Option<String> = conn
        .query_first(format!(
            "SELECT username from users WHERE username = \"{}\" AND password = MD5(\"{}{}\")",
            credentials.user_id, credentials.user_id, credentials.password
        ))
        .unwrap();

    if user.is_some() {
        return true;
    } else {
        return false;
    }
}
