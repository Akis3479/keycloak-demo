import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'https://m4d-water.iti.gr/keycloak',
  realm: 'demo-realm',
  clientId: 'api-client'
});

export default keycloak;