import React, { Component, Fragment } from "react";
import Header from "../components/Header";
import Link from "next/link";

class Notfound extends Component {
  // eslint-disable-next-line class-methods-use-this
  render() {
    return (
      <Fragment>
        <Header isOnboarding={false} />
        <div className="main-content pt-0 bg-white ps-0 pe-0">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-6 col-md-8 text-center default-page vh-100 align-items-center d-flex">
                <div className="card border-0 text-center d-block p-0">
                  <img
                    src="https://via.placeholder.com/300x300.png"
                    alt="icon"
                    className="w200 mb-4 ms-auto me-auto pt-md-5"
                  />
                  <h1 className="fw-700 text-grey-900 display3-size display4-md-size">
                    Oops! It looks like you&apos;re lost.
                  </h1>
                  <p className="text-grey-500 font-xsss">
                    The page you&apos;re looking for isn&apos;t available. Try
                    to search again or use the go to.
                  </p>
                  <Link
                    href="/"
                    className="p-3 w175 bg-current text-white d-inline-block text-center fw-600 font-xssss rounded-3 text-uppercase ls-3"
                  >
                    Home Page
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Notfound;
