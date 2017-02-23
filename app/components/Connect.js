import React, { Component, PropTypes } from 'react';
import { If, Then } from 'react-if';
import cheapRuler from 'cheap-ruler';
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';
import { Layout, Container, Header } from './Layout';
import { servers, ConnectionState } from '../constants';

export default class Connect extends Component {
  
  static propTypes = {
    settings: PropTypes.object.isRequired,
    onConnect: PropTypes.func.isRequired,
    onDisconnect: PropTypes.func.isRequired
  };

  constructor() {
    super();

    this.state = { 
      userLocation: {
        coordinate: [40.706213526877455, -74.0044641494751],
        city: 'New York',
        country: 'USA'
      }
    };
  }

  onSettings() {
    this.props.router.push('/settings');
  }

  onSelectLocation() {
    this.props.router.push('/select-location');
  }

  onConnect() {
    const server = this.props.settings.preferredServer;
    this.props.onConnect(server);
  }

  onDisconnect() {
    this.props.onDisconnect();
  }

  serverInfo(key) {
    switch(key) {
    case 'fastest': 
      return {
        name: 'Fastest',
        city: 'New York',
        country: 'USA',
        location: [40.7127837, -74.0059413]
      };
    case 'nearest':
      return {
        name: 'Nearest',
        city: 'New York',
        country: 'USA',
        location: [40.7127837, -74.0059413]
      };
    default: return servers[key] || {};
    }
  }

  headerStyle() {
    const S = Header.Style;
    switch(this.props.connect.status) {
    case ConnectionState.disconnected: return S.error;
    case ConnectionState.connected: return S.success;
    default: return S.default;
    }
  }

  networkSecurityClass() {
    let classes = ['connect__status-security'];
    if(this.props.connect.status === ConnectionState.connected) {
      classes.push('connect__status-security--secure');
    } else if(this.props.connect.status === ConnectionState.disconnected) {
      classes.push('connect__status-security--unsecured');
    }

    return classes.join(' ');
  }

  networkSecurityMessage() {
    switch(this.props.connect.status) {
    case ConnectionState.connected: return 'Secured connection';
    case ConnectionState.connecting: return 'Creating secure connection';
    default: return 'Unsecured connection';
    }
  }

  displayLocation() {
    if(this.props.connect.status === ConnectionState.disconnected) {
      return this.state.userLocation.coordinate;
    }
    
    const preferredServer = this.props.settings.preferredServer;
    const serverInfo = this.serverInfo(preferredServer);

    return serverInfo.location;
  }

  getBounds(center) {
    const ruler = cheapRuler(center[0], 'meters');
    const bbox = ruler.bufferPoint(center, 100000);
    return [ bbox[1], bbox[0], bbox[3], bbox[2] ]; // <lng>, <lat>, <lng>, <lat>
  }

  render() {
    const preferredServer = this.props.settings.preferredServer;
    const serverInfo = this.serverInfo(preferredServer);
    const displayLocation = this.displayLocation();
    const markerLocation = [ displayLocation[1], displayLocation[0] ]; // <lng>, <lat>

    const isConnecting = this.props.connect.status === ConnectionState.connecting;
    const isConnected = this.props.connect.status === ConnectionState.connected;
    const isDisconnected = this.props.connect.status === ConnectionState.disconnected;

    const accessToken = 'pk.eyJ1IjoicHJvbmViaXJkIiwiYSI6ImNpemk5cmk1MDAxd3IzM21paXgzNmI4M3oifQ.kbwLbnjVCvZHXS8RH7y-3w';

    return (
      <Layout>
        <Header style={ this.headerStyle() } showSettings={ true } onSettings={ ::this.onSettings } />
        <Container>
          <div className="connect">
            <div className="connect__map">
              <ReactMapboxGl style="mapbox://styles/mapbox/dark-v9"
                  accessToken={ accessToken }
                  containerStyle={{ height: '100%' }} 
                  interactive={ false }
                  fitBounds={ this.getBounds(displayLocation) }
                  fitBoundsOptions={ {offset: [0, -100]} }>
                <Layer type="symbol" id="marker" layout={{ 'icon-image': 'marker-15' }}>
                  <Feature coordinates={ markerLocation } />
                </Layer>
              </ReactMapboxGl>
            </div>
            <div className="connect__container">

              <div className="connect__status">
                { /* show spinner when connecting */ }
                <If condition={ isConnecting }>
                  <Then>
                    <div className="connect__status-icon">
                      <img src="./assets/images/icon-spinner.svg" alt="" />
                    </div>
                  </Then>
                </If>
                
                <div className={ this.networkSecurityClass() }>{ this.networkSecurityMessage() }</div>
                <div className="connect__status-location">{ serverInfo.city }<br/>{ serverInfo.country }</div>
                <div className="connect__status-ipaddress">{ this.props.connect.clientIp }</div>
              </div>

              { /* footer when disconnected */ }
              <If condition={ isDisconnected }>
                <Then>
                  <div className="connect__footer">
                    <div className="connect__row">

                      <div className="connect__server" onClick={ ::this.onSelectLocation }>
                        <div className="connect__server-label">Connect to</div>                    
                        <div className="connect__server-value">

                          <If condition={ preferredServer === 'fastest' }>
                            <Then>
                              <img className="connect__server-icon" src="./assets/images/icon-fastest.svg" />
                            </Then>
                          </If>
                            
                          <If condition={ preferredServer === 'nearest' }>
                            <Then>
                              <img className="connect__server-icon" src="./assets/images/icon-nearest.svg" />
                            </Then>
                          </If>

                          <div className="connect__server-name">{ serverInfo.name }</div>

                        </div>
                      </div>
                    </div>

                    <div className="connect__row">
                      <button className="connect__footer-button connect__footer-button--connect" onClick={ ::this.onConnect }>Secure my connection</button>
                    </div>
                  </div>
                </Then>
              </If>
              
              { /* footer when connecting */ }
              <If condition={ isConnecting }>
                <Then>
                  <div className="connect__footer">
                    <div className="connect__row">
                      <button className="connect__footer-button connect__footer-button--switch" onClick={ ::this.onSelectLocation }>Switch location</button>
                    </div>

                    <div className="connect__row">
                      <button className="connect__footer-button connect__footer-button--disconnect" onClick={ ::this.onDisconnect }>Cancel</button>
                    </div>
                  </div>
                </Then>
              </If>

              { /* footer when connected */ }
              <If condition={ isConnected }>
                <Then>
                  <div className="connect__footer">
                    <div className="connect__row">
                      <button className="connect__footer-button connect__footer-button--switch" onClick={ ::this.onSelectLocation }>Switch location</button>
                    </div>

                    <div className="connect__row">
                      <button className="connect__footer-button connect__footer-button--disconnect" onClick={ ::this.onDisconnect }>Disconnect</button>
                    </div>
                  </div>
                </Then>
              </If>

            </div>
          </div>
        </Container>
      </Layout>
    );
  }
}
