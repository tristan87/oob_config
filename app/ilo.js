/*jshint esversion: 8 */

module.exports = (config) => {
  return {
    commands: [
      `set /map1/ manual_iLO_reset=yes`,
      `set /map1/dhcpendpt1 EnabledState=no`,
      `set /map1/dnsendpt1 EnabledState=yes Hostname=${config.formattedHostname}`,
      `set /map1/enetport1/lanendpt1/ipendpt1 IPv4Address=${config.currentIP} SubnetMask=${config.netmask}`,
      `set /map1/gateway1 AccessInfo=${config.gateway}`,
      `set /map1/settings1/DNSSettings1 DNSServerAddress=0.0.0.0 RegisterThisConnection=no oemHPE_UseDHCPv4DomainName=no`,
      `set /map1/settings1/WINSSettingData1 WINSServerAddress=0.0.0.0, 0.0.0.0 RegisterThisConnection=no DHCPOptionToUse=no`,
      `create /map1/accounts1/ username=${config.setUsername} password=${config.setPassword}`,
    ],
    successRegex: /status_tag=COMMAND COMPLETED/g,
    commandRegex: /<\/>hpiLO-> set /g,
    commandModifier: 1
  };
};
