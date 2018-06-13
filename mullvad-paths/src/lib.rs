#[cfg(any(windows, target_os = "macos"))]
extern crate app_dirs;
#[macro_use]
extern crate error_chain;
#[macro_use]
extern crate log;


#[cfg(any(windows, target_os = "macos"))]
mod metadata {
    use app_dirs::AppInfo;

    pub const PRODUCT_NAME: &str = "Mullvad VPN";

    pub const APP_INFO: AppInfo = AppInfo {
        name: PRODUCT_NAME,
        author: "Mullvad",
    };
}


error_chain! {
    errors {
        CreateDirFailed { description("Failed to create directory") }
        #[cfg(windows)]
        NoProgramDataDir { description("Missing %ALLUSERSPROFILE% environment variable") }
    }
}

mod cache;
pub use cache::cache_dir;

mod logs;
pub use logs::{get_log_dir, log_dir};

mod resources;
pub use resources::get_resource_dir;

mod rpc_address;
pub use rpc_address::get_rpc_address_path;

mod settings;
pub use settings::settings_dir;
