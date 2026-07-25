<template>
  <NuxtLayout name="error">
    <div class="password-table">
      <div class="password-cell"></div>
      <div class="password-page password-cell text-center">
        <div class="password-main text-center">
          <div class="password-main__inner">
            <NuxtLink to="/" class="site-header__logo-image">
              <img src="/images/logo.svg" alt="Belle Store" />
            </NuxtLink>
            <h2 class="password__title"><b>This page has wandered off</b></h2>
            <p class="password__form-heading h4">
              The page you're looking for doesn't exist or may have moved.
            </p>
            <p>
              <NuxtLink to="/" class="btn btn--has-icon-after">
                Continue shopping
                <i class="fa fa-caret-right" aria-hidden="true"></i>
              </NuxtLink>
            </p>
            <div class="password-social-sharing">
              <ul class="list--inline site-footer__social-icons social-icons">
                <li>
                  <a class="social-icons__link" href="#" title="Belle Store on Facebook"
                    ><i class="icon icon-facebook"></i
                  ></a>
                </li>
                <li>
                  <a class="social-icons__link" href="#" title="Belle Store on Twitter"
                    ><i class="icon icon-twitter"></i
                  ></a>
                </li>
                <li>
                  <a class="social-icons__link" href="#" title="Belle Store on Instagram"
                    ><i class="icon icon-instagram"></i
                  ></a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
