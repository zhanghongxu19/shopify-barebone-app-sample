# Overview
This is _unoffical_ sample code for scratch building [Shopify app](https://shopify.dev/apps) _without_ [CLI automatic cocde generation](https://shopify.dev/apps/getting-started/create) for learing how it works with simple React and GraphQL knowledge.

Making clear, simple, and fewest code is this purpose that's why it doesn't use the CLI generated code.

Reading [Shopify OAuth flow](https://shopify.dev/apps/auth/oauth/getting-started) might help you to grab the basic.

For quick start with automatically generated code, go to the [official CLI tutorial](https://shopify.dev/apps/getting-started/build-app-example).

# Code structure
```
--------- Backend process in a server (Node.js) ---------
app.js ... Koa Node.js app for backend for app install endpoints, GraphQL API calls, and DB access, etc. No Shopify libraries or CLI generated code used.

package.json ... app.js used npm libaries and scripts for building and running this app.

views/ ... holds Koa Node.js dynamic rendering htmls. This is a SPA app which uses index.html only generated by Vite build in frontend.
  ./index.html ... Koa top page view rendered by app.js server code (for code running, this needs replaced with Vite built one).
public/ ... holds static files hosted by app.js server code (for code running, this needs replaced with Vite built one).

--------- Frontend UI in a browser (React) ---------
frontend/ ... React code base to be built by Vite for app admin UI. All built code runs at the client = browser as minized JS + CSS.

  ./src/ ... React source code with JSX of Shopify App Bridge + Polaris.
  ./index.html ... replaces views/index.html as a Vite built file which renders the root React compoment.  
  ./public/ ... Static files used by React code.
  
  ./package.json ... React code used npm libraries and scripts for building React code with Vite.
  ./vite.config.js ... Vite congfig file for building React code into real runnable minized JS + CSS on browsers.

--------- Extensions with Shopify CLI generation and deployment (Liquid/JavaScript/Wasm, etc.) ---------
extensions/ ... automatically generated directory and code by Shopify CLI `npm run generate extension`.

  ./my-theme-app-ext ... Theme App Extensions sample following this turotial. https://shopify.dev/apps/online-store/theme-app-extensions/getting-started

  ./my-function-discount-ext ... Shopify Functions for Dicounts Extensions sample using Cargo with Rust https://shopify.dev/apps/discounts/create#step-4-add-and-deploy-a-product-discount-extension

  ./my-function-shipping-ext ... Shopify Functions for Delivery Extensions sample using Cargo with Rust https://shopify.dev/apps/checkout/delivery-customizations/getting-started

  ./my-function-payment-ext ... Shopify Functions for Payment Extensions sample using Cargo with Rust https://shopify.dev/apps/checkout/payment-customizations/getting-started

shopify.app.toml ... required file by CLI commands.

```

[React](https://reactjs.org/) ([JSX](https://reactjs.org/docs/introducing-jsx.html), [Props](https://reactjs.org/docs/components-and-props.html), [State](https://reactjs.org/docs/state-and-lifecycle.html), [Hooks](https://reactjs.org/docs/hooks-intro.html), etc.) and [GraphQL](https://graphql.org/) ([Query](https://graphql.org/learn/queries/), [Edges](https://graphql.org/learn/pagination/#pagination-and-edges), [Union](https://graphql.org/learn/schema/#union-types), etc.) are mandatory technologies for manipulating this sample.


For creating React frontend, the following contents might help you.
- [App Bridge Actions](https://shopify.dev/apps/tools/app-bridge/actions)
- [Polaris Compoments by React](https://polaris.shopify.com/components)

For extensions like Admin Link, Theme App Extensinons, Shopify Functtions, and Checkout Extensions, refer to the [app extensions](https://shopify.dev/apps/app-extensions) page.

(
  
*Skip this section as FYI.

In this sample, [CLI generated extensions](https://shopify.dev/apps/tools/cli/commands#generate-extension) are given the following patch to fit to the existing non-CLI-generated codes.
```
1. Execute `npm install --save @shopify/app @shopify/cli` instead of `npm init @shopify/app@latest`, to add those library to 'package.json' dependencies only, to avoid overwriting the exising code.

2. Copy the following script to "scripts" in 'package.json' to execute extension commands from the result of `npm init @shopify/app@latest` in another directory (excluding `"dev": "shopify app dev",`).
   "shopify": "shopify",
   "info": "shopify app info",
   "generate": "shopify app generate",
   "deploy": "shopify app deploy"

3. Copy 'shopify.app.toml' to the root path from the result directory above too.

4. To register extensions to new apps from exsiting codes in '/extensions/', execute `npm run deploy -- --reset` to make a draft extension, and enable "Development Store Preview" in the created extension in your partner dashboard 
(NOTE THAT `npm generate extension` is for the initial code generation only, not required for the extension registration or push).
```

)

# How to run
1. Add the following environmental variables locally or in cloud platforms like Render / Heroku / Fly, etc.
```
SHOPIFY_API_KEY:              YOUR_API_KEY (Copy and paste from your app settings in partner dashboard)
SHOPIFY_API_SECRET:           YOUR_API_SECRET (Copy and paste from your app settings in partner dashboard)
SHOPIFY_API_VERSION:          unstable
SHOPIFY_API_SCOPES:           write_products,write_discounts,read_orders,write_payment_customizations,write_delivery_customizations,write_pixels,read_customer_events,write_customers,write_metaobject_definitions,write_metaobjects

SHOPIFY_DB_TYPE:              MONGODB (Default) / POSTGRESQL / MYSQL

// The followings are required if you set SHOPIFY_DB_TYPE 'MONGODB'
SHOPIFY_MONGO_DB_NAME:        YOUR_DB_NAME (any name is OK)
SHOPIFY_MONGO_URL:            mongodb://YOUR_USER:YOUR_PASSWORD@YOUR_DOMAIN:YOUR_PORT/YOUR_DB_NAME

// The followings are required if you set SHOPIFY_DB_TYPE 'POSTGRESQL'
SHOPIFY_POSTGRESQL_URL:       postgres://YOUR_USER:YOUR_PASSWORD@YOUR_DOMAIN(:YOUR_PORT)/YOUR_DB_NAME

// The followings are required if you set SHOPIFY_DB_TYPE 'MYSQL'
SHOPIFY_MYSQL_HOST:           YOUR_DOMAIN
SHOPIFY_MYSQL_USER:           YOUR_USER
SHOPIFY_MYSQL_PASSWORD:       YOUR_PASSWORD
SHOPIFY_MYSQL_DATABASE:       YOUR_DB_NAME

// The followings are required if you use `webhookcommon` endpoint as a manually created webhook target.
SHOPIFY_WEBHOOK_SECRET:       YOUR_TEST_STORE_WEBHOOK_SIGNATURE given by the webhook creation settings

```

2. Build and run the app server locally or in cloud platforms. All settings are described in `package.json` (note that the built React code contains `SHOPIFY_API_KEY` value from its envrionment variable, so if you run it with your own app, you have to run the build command below at least one time).
```
Build command = npm install && npm run build (= cd frontend && npm install && npm run build && rm -rf ../public/assets && mv dist/assets ../public/assets && mv dist/index.html ../views/index.html  *Replacing Koa intex file with Vite buit code)

Start command = npm run start (= node app.js)

NOTE THAT this sameple doesn't support `npm run dev` in Shopify CLI
```

3. If you run locally, you need to tunnel localhost for public URL as follows (otherwise, the command lines above are usable in Render or other cloud platform deploy scripts).
```
cloudflared tunnel --url localhost:3000 
```

4. Set `YOUR_APP_URL` (your cloudflared or other platform `root` URL) and `YOUR_APP_URL/callback` to your app settings in [partner dashboard](https://partners.shopify.com/). If you add `?external=true` parameter to `YOUR_APP_URL`, the app UX turns into a [service connector](https://user-images.githubusercontent.com/899580/215689359-724b5000-cf86-4b6c-92bf-71b724632059.mp4) which tries to connect Shopify stores with their users. 

5. (For PostgreSQL or MySQL users only,) create the following table in your database (in `psql` or `mysql` command or other tools).
```
For PostgreSQL:

CREATE TABLE shops ( _id VARCHAR NOT NULL PRIMARY KEY, data json NOT NULL, created_at TIMESTAMP NOT NULL, updated_at TIMESTAMP NOT NULL );

For MySQL:

CREATE TABLE shops ( _id VARCHAR(500) NOT NULL PRIMARY KEY, data JSON NOT NULL, created_at TIMESTAMP NOT NULL, updated_at TIMESTAMP NOT NULL );

```
6. For CLI generated extensions, execute `npm run deploy -- --reset` and follow its instruction (choose your partner account, connecting to the exising app, etc.) which registers extensions to your exising app and create `/.env` file which has extensiton ids used by this sample app. After the command ends  successfully, go to the created extension in your [partner dashboard](https://partners.shopify.com/) and enable its dev. preview if available (it's enough for testing in development stores). For [Shopify Functions](https://shopify.dev/api/functions) deployment using [Rust](https://www.rust-lang.org/), you need [Cargo](https://doc.rust-lang.org/cargo/) Wasm package installed first by `cargo install cargo-wasi`.

7. For updating the extensions, execute `npm run deploy` (without `-- --reset`) to apply (upload) your local modified files to the created extensions (`-- --reset` is used for changing your targeted app only).

8. (For live stores only, you need to create a version of the extension and publish it. See [this step](https://shopify.dev/apps/deployment/extension).)


# How to install
Access to the following endpoit.
`https://SHOPIFY_SHOP_DOMAIN/admin/oauth/authorize?client_id=YOUR_API_KEY&scope=YOUR_API_SCOPES&redirect_uri=YOUR_APP_URL/callback&state=&grant_options[]=`　

Or 

`you can install to your development stores from the app settings in partner dashboard.`

# Sample list

All sample videos are available at [Wiki](https://github.com/benzookapi/shopify-barebone-app-sample/wiki).

- _Session Token_: ['/sessiontoken'](https://user-images.githubusercontent.com/899580/216690835-a8615fb0-0a91-4357-9548-e551a46093f7.mp4) 
  - What's App Bridge session token about and how the authenticated request works.
  - If you are a server provider like OMS / WMS / MA / CRM connecting Shopify, let's check [this external service connection demo](https://user-images.githubusercontent.com/899580/215689359-724b5000-cf86-4b6c-92bf-71b724632059.mp4)
- _Admin Link_: ['/adminlink'](https://user-images.githubusercontent.com/899580/216701356-63f44dbe-8525-4d53-a721-6a729b0cd126.mp4) 
  - How to manage and protect admin links regardless of embedded or unembedded.
- _Theme App Extension_: ['/themeappextension'](https://user-images.githubusercontent.com/899580/216705808-70d3b6ad-f7b7-4091-95ec-c45cc9a79502.mp4) 
  - Basis usage in combination with App Proxies and Theme Editor
  - For [Line item properties](https://shopify.dev/docs/themes/architecture/templates/product#line-item-properties), and [Cart notes and attributes](https://shopify.dev/docs/themes/architecture/templates/cart#support-cart-notes-and-attributes) insertion, see [this no Liquid touched demo](https://github-production-user-asset-6210df.s3.amazonaws.com/899580/259701182-f1fb93b5-34da-4440-b10a-fe8ad28d6c68.mp4)
- _Function Discount_: ['/functiondiscount'](https://user-images.githubusercontent.com/899580/216708433-be7bbfbd-30aa-480e-a165-e528f33f5901.mp4) 
  - Discount implementation by Shopify Functions in combination with customer metafields
- _Function Shipping_: ['/functionshipping'](https://user-images.githubusercontent.com/899580/218436786-3fcd2802-6acc-4c32-b0ca-030184cbcee5.mp4) 
  - Shipping rate filtering by Shopify Functions with input zip codes
- _Function Payment_: ['/functionpayment'](https://user-images.githubusercontent.com/899580/218440555-dd03d864-71e4-4f26-9414-f0701598c98e.mp4) 
  - Payment method filtering by Shopify Functions with selected shipping rates
- _Web Pixel_: ['/webpixel'](https://user-images.githubusercontent.com/899580/218447647-030d9bca-13e3-40d0-8530-a64e402c359f.mp4) 
  - Checking customer events in a browser console to send them to GA4 Data Streams
- _Post Purchase_: ['/postpurchase'](https://user-images.githubusercontent.com/899580/219054274-a04af128-c1d8-43f6-9a9c-583bff239fcd.mp4)  
  - Switching upsell products and getting shop review scores with product and customer metafields
- _Checkout Extension (Plus only for live stores)_: ['/checkoutextension'](https://user-images.githubusercontent.com/899580/231545192-cd65d59f-78d5-48c6-987b-d2529b6a9e71.mp4)  
  - Reproducing upsell and reviews of post-purchase during checkout with IP address blocking
  - Other use cases are listed in [the section](https://github.com/benzookapi/shopify-barebone-app-sample/wiki#checkout-ui-extensions)
- _Fulfillment_: '/fulfillment' 
  - How to create and control fulfillments (shipping) via API for a specific order (TBD)
- _Transaction_: '/transaction' 
  - How to create and control transactions (payments) via API for a specific order (TBD)
- Metaobject: '/metaobject' 
  - Basic usage (TBD)
- _Multipass (Plus only for live stores)_: '/multipass' 
  - Simple SSO login implementation (TBD)
- _B2B (Plus only for live stores)_: '/b2b' 
  - Sample for creating a company and its onwed customers for B2B checkout (TBD)
- _Bulk Operation_: '/bulkoperation' 
  - Creating large size of data for testing and learing how to manage bulk operation. (TBD)
- _ShopifyQL_: '/shopifyql' 
  - Your own ShopifyQL notebook with API. (TBD)
- _Marketing Activity_: '/marketingactivity' 
  - Basic usage. (TBD)
- _Tokengating_: '/tokengating' 
  - Basic usage. (TBD)

# Trouble shooting

- If you see the error page with the message like `"YOUR_APP_NAME is expired, this is an old app which no logner works after..."` during top page rendering in Shopify admin, check and fix the following major issues.
  - Do not use redirection to the old admin URL of "https://XXX.myshopify.com/admin". Use the new one of "https://admin.shopify.com/store/XXX", instead. Refer to the [migration document](https://shopify.dev/apps/tools/app-bridge/updating-overview#ensure-compatibility-with-the-new-shopify-admin-domain).
  - Your server needs to render the top page at acceptable speed in the right way. Too slow access, error HTTP codes, or server shutdown causes the error above in live stores (not in development ones). Some cloud plarform like Render, Heroku, etc do the very slow response for the first time in a while with free plans, so you need to swtich to [Cloudflare tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/) hosting or pay those services for higher performence. 

# TIPS

- You can use the endpoint of `webhookgdpr` for [GDPR Webhooks](https://shopify.dev/docs/apps/store/security/gdpr-webhooks).
- If you fail to get [protected customer data](https://shopify.dev/docs/apps/store/data-protection/protected-customer-data) in Checkout UI Extension or API Webhook creation even in dev. stores, submit your app first which enable you get them. 

# Disclaimer

- This code is fully _unofficial_ and NOT guaranteed to pass [the public app review](https://shopify.dev/apps/store/review) for Shopify app store. The official requirements are described [here](https://shopify.dev/apps/store/requirements). 
- You need to follow [Shopi API Licene and Terms of Use](https://www.shopify.com/legal/api-terms) even for custom app usage.
