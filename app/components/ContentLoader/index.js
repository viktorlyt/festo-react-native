import { Dimensions, View } from 'react-native';
import React from 'react';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import { BaseColors } from '@config/theme';

const arrayList = [{}, {}, {}, {}, {}, {}, {}];
const NotificationList = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
const Dw = Dimensions.get('window').width;
const Dh = Dimensions.get('window').height;

const cmnCSS = { flex: 1 };
const cmnCSS3 = { flex: 1, paddingTop: 100 };

const loaderBGColor = '#dcdcdc';
const loaderFGColor = '#f7f7f7';
export const DashboardContentLoader = () => {
  return (
    <View style={cmnCSS}>
      <ContentLoader
        speed={2}
        width={Dw}
        height={Dh}
        backgroundColor={loaderBGColor}
        foregroundColor={loaderFGColor}>
        {arrayList.map((obj, index) => {
          return (
            <>
              <Rect x="20" y={'60'} height="10" width={'100%'} />
              <Circle cx={50} cy={50} r="50" />
              <Rect x="25" y={50} rx="5" ry="5" height="6" width={'100%'} />
              <Rect x={50} y={10} rx="5" ry="5" height="6" width={90} />
            </>
          );
        })}
      </ContentLoader>
    </View>
  );
};

export const PartyContentLoader = () => {
  const XV = 20;
  const XY = 20;
  const TY = 210 + XY;
  return (
    <View style={cmnCSS}>
      <ContentLoader
        speed={2}
        width={Dw}
        height={Dh}
        backgroundColor={loaderBGColor}
        foregroundColor={loaderFGColor}>
        {arrayList.map((obj, index) => {
          return (
            <>
              <Rect x={XV} y={XY} rx="15" ry="15" height="200" width={'90%'} />
              <Circle x={XV} y={TY} cx={25} cy={25} r="25" />
              <Rect
                x={XV + 60}
                y={TY + 10}
                rx="5"
                ry="5"
                height="12"
                width={200}
              />
              <Rect
                x={XV + 60}
                y={TY + 30}
                rx="5"
                ry="5"
                height="10"
                width={150}
              />
              <Circle x={XV + 310} y={TY} cx={20} cy={20} r="20" />
              <Rect x={XV} y={TY + 60} rx="5" ry="5" height="15" width={260} />
              <Rect x={XV} y={TY + 90} rx="5" ry="5" height="25" width={30} />
              <Rect
                x={XV + 50}
                y={TY + 95}
                rx="5"
                ry="5"
                height="12"
                width={120}
              />
              <Rect x={XV} y={TY + 120} rx="5" ry="5" height="25" width={30} />
              <Rect
                x={XV + 50}
                y={TY + 125}
                rx="5"
                ry="5"
                height="12"
                width={120}
              />
              <Rect x={XV} y={TY + 150} rx="5" ry="5" height="25" width={30} />
              <Rect
                x={XV + 50}
                y={TY + 155}
                rx="5"
                ry="5"
                height="12"
                width={120}
              />
              <Rect x={XV} y={TY + 180} rx="5" ry="5" height="25" width={30} />
              <Rect
                x={XV + 50}
                y={TY + 185}
                rx="5"
                ry="5"
                height="12"
                width={120}
              />
              <Rect x={XV} y={TY + 210} rx="5" ry="5" height="25" width={30} />
              <Rect
                x={XV + 50}
                y={TY + 215}
                rx="5"
                ry="5"
                height="12"
                width={120}
              />
              <Rect
                x={XV}
                y={TY + 250}
                rx="5"
                ry="5"
                height="50"
                width={'90%'}
              />
              <View>
                <Rect
                  x={XV}
                  y={TY + 310}
                  rx="15"
                  ry="15"
                  height="50"
                  width={'42%'}
                />
                <Rect
                  x={XV + 180}
                  y={TY + 310}
                  rx="15"
                  ry="15"
                  height="50"
                  width={'42%'}
                />
              </View>
              <Rect
                x={XV}
                y={TY + 400}
                rx="15"
                ry="15"
                height="200"
                width={'90%'}
              />
            </>
          );
        })}
      </ContentLoader>
    </View>
  );
};

export const ListContentLoader = () => {
  return (
    <View style={cmnCSS}>
      <ContentLoader
        speed={2}
        width={Dw}
        height={Dh}
        backgroundColor={loaderBGColor}
        foregroundColor={loaderFGColor}>
        {arrayList.map((obj, index) => {
          const FL = index === 0 ? 25 : index === 1 ? 98 : index * 90;
          const HD = index === 0 ? 50 : FL + 30;
          const MSG = index === 0 ? 20 : FL + 0;
          return (
            <>
              <Circle x="10" y={FL} cx={30} cy={30} r="30" />
              <Rect x={80} y={FL} rx="5" ry="5" height="12" width={180} />
              <Rect x={80} y={HD} rx="5" ry="5" height="10" width={120} />
              <Rect
                x={Dw - 115}
                y={MSG}
                rx="25"
                ry="25"
                height="45"
                width={95}
              />
            </>
          );
        })}
      </ContentLoader>
    </View>
  );
};

export const NotificationLoader = () => {
  return (
    <View style={cmnCSS}>
      <ContentLoader
        speed={2}
        width={Dw}
        height={Dh}
        backgroundColor={loaderBGColor}
        foregroundColor={loaderFGColor}>
        {NotificationList.map((obj, index) => {
          const FL = index === 0 ? 25 : index === 1 ? 90 : index * 80;
          const HD = index === 0 ? 50 : FL + 30;
          return (
            <>
              <Circle x="10" y={FL} cx={25} cy={25} r="25" />
              <Rect x={80} y={FL} rx="5" ry="5" height="12" width={180} />
              <Rect x={80} y={HD} rx="5" ry="5" height="10" width={120} />
              <Rect x={Dw - 100} y={FL} rx="5" ry="5" height="10" width={80} />
            </>
          );
        })}
      </ContentLoader>
    </View>
  );
};
export const ChatLoader = () => {
  return (
    <View style={cmnCSS}>
      <ContentLoader
        speed={2}
        width={Dw}
        height={Dh}
        backgroundColor={loaderBGColor}
        foregroundColor={loaderFGColor}>
        {NotificationList.map((obj, index) => {
          const FL = index === 0 ? 25 : index === 1 ? 90 : index * 80;
          const HD = index === 0 ? 50 : FL + 30;
          return (
            <>
              <Circle x="10" y={FL} cx={25} cy={25} r="25" />
              <Rect x={80} y={FL} rx="5" ry="5" height="12" width={180} />
              <Rect x={80} y={HD} rx="5" ry="5" height="10" width={120} />
              <Rect x={Dw - 100} y={FL} rx="5" ry="5" height="10" width={80} />
            </>
          );
        })}
      </ContentLoader>
    </View>
  );
};

export const DiscoverListLoader = (props) => {
  const { style } = props;

  const XV = 20;
  const XY = 20;
  return (
    <View style={cmnCSS}>
      <ContentLoader
        speed={2}
        width={Dw}
        height={Dh}
        backgroundColor={loaderBGColor}
        foregroundColor={loaderFGColor}>
        {arrayList.map((obj, index) => {
          return (
            <>
              <Rect x={XV} y={XY} rx="5" ry="5" height="12" width={140} />
              <Rect x={XV + 270} y={XY} rx="5" ry="5" height="12" width={80} />
              <>
                <Rect
                  x={XV}
                  y={XY + 25}
                  rx="15"
                  ry="15"
                  height="100"
                  width={'55%'}
                />
                <Circle x={XV} y={XY + 140} cx={20} cy={20} r="20" />
                <Rect
                  x={XV + 50}
                  y={XY + 140}
                  rx="5"
                  ry="5"
                  height="12"
                  width={140}
                />
                <Rect
                  x={XV + 50}
                  y={XY + 160}
                  rx="5"
                  ry="5"
                  height="12"
                  width={80}
                />
                <Rect
                  x={XV}
                  y={XY + 190}
                  rx="5"
                  ry="5"
                  height="12"
                  width={180}
                />
                <Rect
                  x={XV}
                  y={XY + 210}
                  rx="5"
                  ry="5"
                  height="25"
                  width={30}
                />
                <Rect
                  x={XV + 50}
                  y={XY + 215}
                  rx="5"
                  ry="5"
                  height="12"
                  width={120}
                />
                <Circle x={XV} y={XY + 240} cx={15} cy={15} r="15" />
                <Rect
                  x={XV + 50}
                  y={XY + 240}
                  rx="5"
                  ry="5"
                  height="12"
                  width={120}
                />
              </>
              <>
                <Rect
                  x={XV + Dw / 1.7}
                  y={XY + 25}
                  rx="15"
                  ry="15"
                  height="100"
                  width={'55%'}
                />
                <Circle x={XV + Dw / 1.7} y={XY + 140} cx={20} cy={20} r="20" />
                <Rect
                  x={XV + Dw / 1.36}
                  y={XY + 140}
                  rx="5"
                  ry="5"
                  height="12"
                  width={140}
                />
                <Rect
                  x={XV + Dw / 1.36}
                  y={XY + 160}
                  rx="5"
                  ry="5"
                  height="12"
                  width={80}
                />
                <Rect
                  x={XV + Dw / 1.7}
                  y={XY + 190}
                  rx="5"
                  ry="5"
                  height="12"
                  width={180}
                />
                <Rect
                  x={XV + Dw / 1.7}
                  y={XY + 210}
                  rx="5"
                  ry="5"
                  height="25"
                  width={30}
                />
                <Rect
                  x={XV + Dw / 1.36}
                  y={XY + 215}
                  rx="5"
                  ry="5"
                  height="12"
                  width={120}
                />
                <Circle x={XV} y={XY + 240} cx={15} cy={15} r="15" />
                <Rect
                  x={XV + Dw / 1.36}
                  y={XY + 240}
                  rx="5"
                  ry="5"
                  height="12"
                  width={120}
                />
              </>
            </>
          );
        })}
      </ContentLoader>
    </View>
  );
};
export const EventContentLoader = () => {
  const XV = 20;
  const XY = 20;
  const TY = 210 + XY;
  return (
    <View style={cmnCSS}>
      <ContentLoader
        speed={2}
        width={Dw}
        height={Dh}
        backgroundColor={loaderBGColor}
        foregroundColor={loaderFGColor}>
        {arrayList.map((obj, index) => {
          return (
            <>
              <Rect x={XV} y={XY} rx="15" ry="15" height="200" width={'90%'} />
              <Circle x={XV} y={TY} cx={25} cy={25} r="25" />
              <Rect
                x={XV + 60}
                y={TY + 10}
                rx="5"
                ry="5"
                height="12"
                width={200}
              />
              <Rect
                x={XV + 60}
                y={TY + 30}
                rx="5"
                ry="5"
                height="10"
                width={150}
              />
              <Circle x={XV + 310} y={TY} cx={20} cy={20} r="20" />
              <Rect x={XV} y={TY + 60} rx="5" ry="5" height="25" width={30} />
              <Rect
                x={XV + 40}
                y={TY + 70}
                rx="5"
                ry="5"
                height="12"
                width={250}
              />
              <Rect x={XV} y={TY + 110} rx="5" ry="5" height="12" width={200} />

              <Rect
                x={XV}
                y={TY + 145}
                rx="5"
                ry="5"
                height="12"
                width={'90%'}
              />
              <Rect
                x={XV}
                y={TY + 155}
                rx="5"
                ry="5"
                height="12"
                width={'90%'}
              />
              <Rect
                x={XV}
                y={TY + 165}
                rx="5"
                ry="5"
                height="12"
                width={'90%'}
              />
              <Rect
                x={XV}
                y={TY + 175}
                rx="5"
                ry="5"
                height="12"
                width={'90%'}
              />
              <Rect
                x={XV}
                y={TY + 185}
                rx="5"
                ry="5"
                height="12"
                width={'90%'}
              />
              <Rect
                x={XV}
                y={TY + 220}
                rx="20"
                ry="20"
                height="150"
                width={'90%'}
              />
              <Rect
                x={XV}
                y={TY + 390}
                rx="15"
                ry="15"
                height="50"
                width={'90%'}
              />
              <Rect x={XV} y={TY + 450} rx="5" ry="5" height="12" width={200} />
              <Rect
                x={XV}
                y={TY + 470}
                rx="5"
                ry="5"
                height="12"
                width={'90%'}
              />
              <Rect
                x={XV}
                y={TY + 485}
                rx="5"
                ry="5"
                height="12"
                width={'90%'}
              />
            </>
          );
        })}
      </ContentLoader>
    </View>
  );
};

export const ProfileContentLoader = () => {
  return (
    <View
      style={[
        cmnCSS3,
        { paddingHorizontal: 20, backgroundColor: BaseColors.white },
      ]}>
      <ContentLoader
        speed={2}
        width={Dw}
        height={Dh}
        backgroundColor={loaderBGColor}
        foregroundColor={loaderFGColor}>
        <Circle cx={Dw / 2 - 25} cy="105" r="70" />
        {/* Name */}
        <Rect x="00" y={Dh / 4 + 50} rx="2" ry="2" width="150" height="12" />
        {/* Edit icon */}
        <Circle cx={Dw - 55} cy={Dh / 4 + 55} r="9" />
        {/* Bio */}
        <Rect x="00" y={Dh / 4 + 67} rx="2" ry="2" width="100" height="9" />
        {/* border */}
        <Rect
          x="00"
          y={Dh / 4 + 96}
          rx="0"
          ry="0"
          width={Dimensions.get('window').width - 40}
          height="1"
        />
        {/*Details */}
        {/*1st row */}
        <Rect x="0" y={Dh / 4 + 120} rx="2" ry="2" width="18" height="18" />
        <Rect x="35" y={Dh / 4 + 124.5} rx="2" ry="2" width="100" height="9" />
        {/*2nd row */}

        <Rect x="0" y={Dh / 4 + 146} rx="2" ry="2" width="18" height="18" />
        <Rect x="35" y={Dh / 4 + 150.5} rx="2" ry="2" width="100" height="9" />
        {/*3rd row */}
        <Rect x="0" y={Dh / 4 + 172} rx="2" ry="2" width="18" height="18" />
        <Rect x="35" y={Dh / 4 + 176.5} rx="2" ry="2" width="100" height="9" />
        {/* border */}
        <Rect
          x="00"
          y={Dh / 4 + 204}
          rx="0"
          ry="0"
          width={Dw - 40}
          height="1"
        />
        {/* My Parties */}
        <Rect x="00" y={Dh / 4 + 233} rx="2" ry="2" width="150" height="12" />
        <Rect x={50} y={Dh / 4 + 253} rx="8" ry="8" width="50" height="15" />
        <Rect
          x={Dw / 2 - 50}
          y={Dh / 4 + 253}
          rx="8"
          ry="8"
          width="50"
          height="15"
        />
        <Rect
          x={Dw - 140}
          y={Dh / 4 + 253}
          rx="8"
          ry="8"
          width="50"
          height="15"
        />
        <Rect
          x="00"
          y={Dh / 4 + 288}
          rx="10"
          ry="10"
          width={Dw - 40}
          height={Dh / 4}
        />
      </ContentLoader>
    </View>
  );
};

export const DiscoverListContentLoader = () => {
  return (
    <View style={[{ paddingHorizontal: 10 }]}>
      <ContentLoader
        speed={2}
        width={Dw}
        height={Dh}
        backgroundColor={loaderBGColor}
        foregroundColor={loaderFGColor}>
        {arrayList.map((obj, index) => {
          const top = index == 0 ? 35 : index * 343;
          const CH = top + 133; //168
          const HIH = CH + 60; //228
          const HT1H = CH + 50;
          const HT2H = CH + 67;
          const EIH = CH + 86;
          const ETI = CH + 106;
          const ETT = CH + 110.5;
          const FCI = CH + 146;
          const FCT = CH + 140;
          return (
            <>
              <Rect
                x="00"
                y={top}
                rx="10"
                ry="10"
                width={Dw - 40}
                height={168}
              />
              <Circle cx={20} cy={HIH} r="20" />
              {/* Name */}
              <Rect x={50} y={HT1H} rx="2" ry="2" width="150" height="12" />
              {/* Bio */}
              <Rect x="50" y={HT2H} rx="2" ry="2" width="100" height="9" />
              <Rect x="00" y={EIH} rx="2" ry="2" width="200" height="12" />
              <Rect x="00" y={ETI} rx="2" ry="2" width="18" height="18" />
              <Rect x="28" y={ETT} rx="2" ry="2" width="172" height="9" />
              <Circle cx={12} cy={FCI} r="12" />
              <Rect x="28" y={FCT} rx="2" ry="2" width="230" height="12" />
            </>
          );
        })}
      </ContentLoader>
    </View>
  );
};

export const GetPaidCLoader = () => {
  const top = 10;
  const CH = top + 80;
  const BT1H = CH + 50;
  const BT2H = CH + 60;
  const BN = BT1H + 32;
  const AN = BN + 29;
  const ANU = AN + 29;
  const AT = ANU + 29;
  const H = AT + 39;
  const H1 = H + 32;
  const H1N = H + 32;
  const H2 = H1 + 70;
  const H2N = H1 + 70;
  const H3 = H2 + 70;
  const H3N = H2 + 70;
  const H4 = H3 + 70;
  const H4N = H3 + 70;
  const H5 = H4 + 70;
  const H5N = H4 + 70;

  return (
    <View style={[{ paddingHorizontal: 10 }]}>
      <ContentLoader
        speed={2}
        width={Dw}
        height={Dh}
        backgroundColor={loaderBGColor}
        foregroundColor={loaderFGColor}>
        <Rect x="00" y={top} rx="10" ry="10" width={Dw / 2 - 30} height={100} />
        <Rect
          x={Dw / 2 - 10}
          y={top}
          rx="10"
          ry="10"
          width={Dw / 2 - 30}
          height={100}
        />
        <Rect x="00" y={BT1H} rx="2" ry="2" width="150" height="12" />
        <Circle cx={Dw - 49} cy={BT2H} r="9" />
        <Rect x="0" y={BN} rx="2" ry="2" width="172" height="9" />
        <Rect x={Dw - 100} y={BN} rx="2" ry="2" width="60" height="9" />

        <Rect x="0" y={AN} rx="2" ry="2" width="172" height="9" />
        <Rect x={Dw - 100} y={AN} rx="2" ry="2" width="60" height="9" />

        <Rect x="0" y={ANU} rx="2" ry="2" width="172" height="9" />
        <Rect x={Dw - 100} y={ANU} rx="2" ry="2" width="60" height="9" />

        <Rect x="0" y={AT} rx="2" ry="2" width="172" height="9" />
        <Rect x={Dw - 100} y={AT} rx="2" ry="2" width="60" height="9" />

        <Rect x="00" y={H} rx="2" ry="2" width="150" height="12" />

        <Rect x="00" y={H1} rx="2" ry="2" width="50" height="50" />
        <Rect x="70" y={H1N} rx="2" ry="2" width="80" height="9" />
        <Rect x="70" y={H1N + 20} rx="2" ry="2" width="80" height="9" />
        <Rect x="70" y={H1N + 40} rx="2" ry="2" width="80" height="9" />
        <Rect x={Dw - 100} y={H1} rx="2" ry="2" width="60" height="9" />
        <Rect x={Dw - 100} y={H1 + 20} rx="2" ry="2" width="60" height="9" />

        <Rect x="00" y={H2} rx="2" ry="2" width="50" height="50" />
        <Rect x="70" y={H2N} rx="2" ry="2" width="80" height="9" />
        <Rect x="70" y={H2N + 20} rx="2" ry="2" width="80" height="9" />
        <Rect x="70" y={H2N + 40} rx="2" ry="2" width="80" height="9" />
        <Rect x={Dw - 100} y={H2} rx="2" ry="2" width="60" height="9" />
        <Rect x={Dw - 100} y={H2 + 20} rx="2" ry="2" width="60" height="9" />

        <Rect x="00" y={H3} rx="2" ry="2" width="50" height="50" />
        <Rect x="70" y={H3N} rx="2" ry="2" width="80" height="9" />
        <Rect x="70" y={H3N + 20} rx="2" ry="2" width="80" height="9" />
        <Rect x="70" y={H3N + 40} rx="2" ry="2" width="80" height="9" />
        <Rect x={Dw - 100} y={H3} rx="2" ry="2" width="60" height="9" />
        <Rect x={Dw - 100} y={H3 + 20} rx="2" ry="2" width="60" height="9" />

        <Rect x="00" y={H4} rx="2" ry="2" width="50" height="50" />
        <Rect x="70" y={H4N} rx="2" ry="2" width="80" height="9" />
        <Rect x="70" y={H4N + 20} rx="2" ry="2" width="80" height="9" />
        <Rect x="70" y={H4N + 40} rx="2" ry="2" width="80" height="9" />
        <Rect x={Dw - 100} y={H4} rx="2" ry="2" width="60" height="9" />
        <Rect x={Dw - 100} y={H4 + 20} rx="2" ry="2" width="60" height="9" />

        <Rect x="00" y={H5} rx="2" ry="2" width="50" height="50" />
        <Rect x="70" y={H5N} rx="2" ry="2" width="80" height="9" />
        <Rect x="70" y={H5N + 20} rx="2" ry="2" width="80" height="9" />
        <Rect x="70" y={H5N + 40} rx="2" ry="2" width="80" height="9" />
        <Rect x={Dw - 100} y={H5} rx="2" ry="2" width="60" height="9" />
        <Rect x={Dw - 100} y={H5 + 20} rx="2" ry="2" width="60" height="9" />
      </ContentLoader>
    </View>
  );
};

export const BiilingCLoader = () => {
  const top = 10;
  const H = Dh / 4 + 80;
  const H1 = H + 32;
  const H1N = H + 32;
  const H2 = H1 + 70;
  const H2N = H1 + 70;
  const H3 = H2 + 70;
  const H3N = H2 + 70;
  const H4 = H3 + 70;
  const H4N = H3 + 70;
  const H5 = H4 + 70;
  const H5N = H4 + 70;

  return (
    <View style={[{ paddingHorizontal: 10 }]}>
      <ContentLoader
        speed={2}
        width={Dw}
        height={Dh}
        backgroundColor={loaderBGColor}
        foregroundColor={loaderFGColor}>
        <Rect x="00" y="35" rx="10" ry="10" width={Dw - 40} height={Dh / 4} />

        <Rect x="00" y={H} rx="2" ry="2" width="150" height="12" />

        <Rect x="00" y={H1} rx="2" ry="2" width="50" height="50" />
        <Rect x="70" y={H1N} rx="2" ry="2" width="80" height="9" />
        <Rect x="70" y={H1N + 20} rx="2" ry="2" width="80" height="9" />
        <Rect x="70" y={H1N + 40} rx="2" ry="2" width="80" height="9" />
        <Rect x={Dw - 100} y={H1} rx="2" ry="2" width="60" height="9" />
        <Rect x={Dw - 100} y={H1 + 20} rx="2" ry="2" width="60" height="9" />

        <Rect x="00" y={H2} rx="2" ry="2" width="50" height="50" />
        <Rect x="70" y={H2N} rx="2" ry="2" width="80" height="9" />
        <Rect x="70" y={H2N + 20} rx="2" ry="2" width="80" height="9" />
        <Rect x="70" y={H2N + 40} rx="2" ry="2" width="80" height="9" />
        <Rect x={Dw - 100} y={H2} rx="2" ry="2" width="60" height="9" />
        <Rect x={Dw - 100} y={H2 + 20} rx="2" ry="2" width="60" height="9" />

        <Rect x="00" y={H3} rx="2" ry="2" width="50" height="50" />
        <Rect x="70" y={H3N} rx="2" ry="2" width="80" height="9" />
        <Rect x="70" y={H3N + 20} rx="2" ry="2" width="80" height="9" />
        <Rect x="70" y={H3N + 40} rx="2" ry="2" width="80" height="9" />
        <Rect x={Dw - 100} y={H3} rx="2" ry="2" width="60" height="9" />
        <Rect x={Dw - 100} y={H3 + 20} rx="2" ry="2" width="60" height="9" />

        <Rect x="00" y={H4} rx="2" ry="2" width="50" height="50" />
        <Rect x="70" y={H4N} rx="2" ry="2" width="80" height="9" />
        <Rect x="70" y={H4N + 20} rx="2" ry="2" width="80" height="9" />
        <Rect x="70" y={H4N + 40} rx="2" ry="2" width="80" height="9" />
        <Rect x={Dw - 100} y={H4} rx="2" ry="2" width="60" height="9" />
        <Rect x={Dw - 100} y={H4 + 20} rx="2" ry="2" width="60" height="9" />

        <Rect x="00" y={H5} rx="2" ry="2" width="50" height="50" />
        <Rect x="70" y={H5N} rx="2" ry="2" width="80" height="9" />
        <Rect x="70" y={H5N + 20} rx="2" ry="2" width="80" height="9" />
        <Rect x="70" y={H5N + 40} rx="2" ry="2" width="80" height="9" />
        <Rect x={Dw - 100} y={H5} rx="2" ry="2" width="60" height="9" />
        <Rect x={Dw - 100} y={H5 + 20} rx="2" ry="2" width="60" height="9" />
      </ContentLoader>
    </View>
  );
};
