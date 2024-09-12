import React, { Component, Fragment } from "react";
import Image from "next/image";
import Link from "next/link";

class Register extends Component {
  // eslint-disable-next-line class-methods-use-this
  render() {
    return (
      <Fragment>
        <div className="main-wrap">
          <div className="nav-header bg-transparent shadow-none border-0">
            <div className="nav-top w-100">
              <Link
                href="/"
                className="d-flex justify-content-start align-items-center"
              >
                <span
                  id="site-logo"
                  className="d-inline-block fredoka-font ls-3 fw-600 text-current font-xxl logo-text mb-0"
                >
                  <Image
                    src="/assets/images/logo/logo-horizontal-white.png"
                    width={220}
                    height={55}
                    style={{ width: "auto", height: "55px" }}
                    alt="logo"
                  />
                </span>{" "}
              </Link>
              <button className="nav-menu me-0 ms-auto"></button>

              <Link
                href="/login"
                className="header-btn d-none d-lg-block bg-dark fw-500 text-white font-xsss p-3 ms-auto w100 text-center lh-20 rounded-xl"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="header-btn d-none d-lg-block bg-current fw-500 text-white font-xsss p-3 ms-2 w100 text-center lh-20 rounded-xl"
              >
                Register
              </Link>
            </div>
          </div>

          <div className="row">
            <div
              className="col-xl-5 d-none d-xl-block p-0 vh-100 bg-image-cover bg-no-repeat"
              style={{
                backgroundImage: `url("https://via.placeholder.com/800x950.png")`,
              }}
            ></div>
            <div className="col-xl-7 vh-100 align-items-center d-flex bg-white rounded-3 overflow-hidden">
              <div className="card shadow-none border-0 ms-auto me-auto login-card">
                <div className="card-body rounded-0 text-left">
                  <h2 className="fw-700 display1-size display2-md-size mb-4">
                    Create <br />
                    your account
                  </h2>
                  <form>
                    <div className="form-group icon-input mb-3">
                      <i className="font-sm ti-user text-grey-500 pe-0"></i>
                      <input
                        type="text"
                        className="style2-input ps-5 form-control text-grey-900 font-xsss fw-600"
                        placeholder="Your Name"
                      />
                    </div>
                    <div className="form-group icon-input mb-3">
                      <i className="font-sm ti-email text-grey-500 pe-0"></i>
                      <input
                        type="text"
                        className="style2-input ps-5 form-control text-grey-900 font-xsss fw-600"
                        placeholder="Your Email Address"
                      />
                    </div>
                    <div className="form-group icon-input mb-3">
                      <input
                        type="Password"
                        className="style2-input ps-5 form-control text-grey-900 font-xss ls-3"
                        placeholder="Password"
                      />
                      <i className="font-sm ti-lock text-grey-500 pe-0"></i>
                    </div>
                    <div className="form-group icon-input mb-1">
                      <input
                        type="Password"
                        className="style2-input ps-5 form-control text-grey-900 font-xss ls-3"
                        placeholder="Confirm Password"
                      />
                      <i className="font-sm ti-lock text-grey-500 pe-0"></i>
                    </div>
                    <div className="form-check text-left mb-3">
                      <input
                        type="checkbox"
                        className="form-check-input mt-2"
                        id="exampleCheck2"
                      />
                      <label className="form-check-label font-xsss text-grey-500">
                        Accept Term and Conditions
                      </label>
                    </div>
                  </form>

                  <div className="col-sm-12 p-0 text-left">
                    <div className="form-group mb-1">
                      <a
                        href="/register"
                        className="form-control text-center style2-input text-white fw-600 bg-dark border-0 p-0 "
                      >
                        Register
                      </a>
                    </div>
                    <h6 className="text-grey-500 font-xsss fw-500 mt-0 mb-0 lh-32">
                      Already have account{" "}
                      <Link href="/login" className="fw-700 ms-1">
                        Login
                      </Link>
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Register;
