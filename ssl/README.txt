SSL Setup on CSMM:-

*REQUIREMENTS:-
You need a Self Signed Certificate or an authorised SSL Certificate. (Use Openssl to generate one or if you have an ssl certified website, just use that for csmm)

Step 1: Copy your *Certificate.crt (ssl certificate) and *private.key and *ca_authority.crt (ca_authority.crt is only for those who aren't 
using a self signed certificate) or if you have a *my-site.pfx file for ssl copy them in \7-days-to-die-server-manager\ssl\ folder.

Step 2: Go to \7-days-to-die-server-manager\config\env\ and open production.js with any text editor of your choice, and look for this:

ssl: {
    //ca: require('fs').readFileSync(require('path').resolve(__dirname,'../../ssl/ca_bundle.crt')),
    //key: require('fs').readFileSync(require('path').resolve(__dirname,'../../ssl/private.key')),
    //cert: require('fs').readFileSync(require('path').resolve(__dirname,'../../ssl/certificate.crt'))
    //pfx: require('fs').readFileSync(require('path').resolve(__dirname,'../../ssl/my-site.pfx'))
  },

For Self-signed certificate uncomment key: and cert:
For Authorised SSL you need to uncomment ca: as well
(NOTE: Make sure your crt file and key name matches with the settings in production.js or csmm will throw an error)

.pfx users only need to uncomment pfx:

Step 3: Save production.js and Start your csmm.

That's all.