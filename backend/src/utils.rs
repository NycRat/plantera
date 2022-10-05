use mysql::{prelude::Queryable, PooledConn};

pub fn get_authorized_username(conn: &mut PooledConn, token: Option<String>) -> Option<String> {
    if let Some(token) = token {
        let user: Option<String> = conn
            .query_first(format!(
                "SELECT username from users WHERE token = \"{}\"",
                &token
            ))
            .unwrap();

        if user.is_some() {
            return user;
        } else {
            return None;
        }
    } else {
        return None;
    }
}
