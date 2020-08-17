import {
  AccountToken,
  BridgeSettings,
  BridgeState,
  DaemonEvent,
  IAccountData,
  IAppVersionInfo,
  ILocation,
  IRelayList,
  ISettings,
  IWireguardPublicKey,
  KeygenEvent,
  RelaySettingsUpdate,
  TunnelState,
  VoucherResponse,
} from '../shared/daemon-rpc-types';

import { CommunicationError, InvalidAccountError } from './errors';
import { GrpcClient, ConnectionObserver, SubscriptionListener } from './grpc-client';

export { ConnectionObserver, SubscriptionListener } from './grpc-client';

export class ResponseParseError extends Error {
  constructor(message: string, private validationErrorValue?: Error) {
    super(message);
  }

  get validationError(): Error | undefined {
    return this.validationErrorValue;
  }
}

export class DaemonRpc {
  constructor(connectionParams: string) {
    this.transport = new GrpcClient(connectionParams);
  }

  private transport: GrpcClient;

  public connect(): Promise<void> {
    return this.transport.connect();
  }

  public disconnect() {
    this.transport.disconnect();
  }

  public addConnectionObserver(observer: ConnectionObserver) {
    this.transport.addConnectionObserver(observer);
  }

  public removeConnectionObserver(observer: ConnectionObserver) {
    this.transport.removeConnectionObserver(observer);
  }

  public async getAccountData(accountToken: AccountToken): Promise<IAccountData> {
    this.transport.getAccountData(accountToken);

  }

  public async getWwwAuthToken(): Promise<string> {
    return this.transport.getWwwAuthToken();
  }

  public async submitVoucher(voucherCode: string): Promise<VoucherResponse> {
    return this.transport.submitVoucher(voucherCode);
  }

  public async getRelayLocations(): Promise<IRelayList> {
    const response = await this.transport.getRelayLocations();
    return { countries: response };
  }

  public async createNewAccount(): Promise<string> {
    return this.transport.createNewAccount();
  }

  public async setAccount(accountToken?: AccountToken): Promise<void> {
    await this.transport.setAccount(accountToken);
  }

  public async updateRelaySettings(relaySettings: RelaySettingsUpdate): Promise<void> {
    if ('normal' in relaySettings) {
      await this.transport.updateRelaySettings(relaySettings.normal);
    }
  }

  public async setAllowLan(allowLan: boolean): Promise<void> {
    await this.transport.setAllowLan(allowLan);
  }

  public async setShowBetaReleases(showBetaReleases: boolean): Promise<void> {
    await this.transport.setShowBetaReleases(showBetaReleases);
  }

  public async setEnableIpv6(enableIpv6: boolean): Promise<void> {
    await this.transport.setEnableIpv6(enableIpv6);
  }

  public async setBlockWhenDisconnected(blockWhenDisconnected: boolean): Promise<void> {
    await this.transport.setBlockWhenDisconnected(blockWhenDisconnected);
  }

  public async setBridgeState(bridgeState: BridgeState): Promise<void> {
    await this.transport.setBridgeState(bridgeState);
  }

  public async setBridgeSettings(bridgeSettings: BridgeSettings): Promise<void> {
    await this.transport.setBridgeSettings(bridgeSettings);
  }

  public async setOpenVpnMssfix(mssfix?: number): Promise<void> {
    await this.transport.setOpenVpnMssfix(mssfix);
  }

  public async setWireguardMtu(mtu?: number): Promise<void> {
    await this.transport.setWireguardMtu(mtu);
  }

  public async setAutoConnect(autoConnect: boolean): Promise<void> {
    await this.transport.setAutoConnect(autoConnect);
  }

  public async connectTunnel(): Promise<void> {
    await this.transport.connectTunnel();
  }

  public async disconnectTunnel(): Promise<void> {
    await this.transport.disconnectTunnel();
  }

  public async reconnectTunnel(): Promise<void> {
    await this.transport.reconnectTunnel();
  }

  public getLocation(): Promise<ILocation> {
    return this.transport.getLocation();
  }

  public getState(): Promise<TunnelState> {
    return this.transport.getState();
  }

  public getSettings(): Promise<ISettings> {
    return this.transport.getSettings();
  }

  public subscribeDaemonEventListener(listener: SubscriptionListener<DaemonEvent>) {
    this.transport.subscribeDaemonEventListener(listener);
  }

  public unsubscribeDaemonEventListener(listener: SubscriptionListener<DaemonEvent>) {
    this.transport.unsubscribeDaemonEventListener(listener);
  }

  public getAccountHistory(): Promise<AccountToken[]> {
    return this.transport.getAccountHistory();
  }

  public async removeAccountFromHistory(accountToken: AccountToken): Promise<void> {
    await this.transport.removeAccountFromHistory(accountToken);
  }

  public getCurrentVersion(): Promise<string> {
    return this.transport.getCurrentVersion();
  }

  public generateWireguardKey(): Promise<KeygenEvent> {
    return this.transport.generateWireguardKey();
  }

  public getWireguardKey(): Promise<IWireguardPublicKey> {
    return this.transport.getWireguardKey();
  }

  public verifyWireguardKey(): Promise<boolean> {
    return this.transport.verifyWireguardKey();
  }

  public async getVersionInfo(): Promise<IAppVersionInfo> {
    return this.transport.getVersionInfo();
  }
}
