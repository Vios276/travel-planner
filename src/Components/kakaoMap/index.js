/*global kakao*/ 
import React, { useEffect } from 'react'
import './map.css'
const Map=(props)=>{

  const lat = props.lat == null ? 35.87572504970846 : props.lat;
  const lon = props.lon == null ? 128.68151215551117 : props.lon;
  
  useEffect(()=>{
    const container = document.getElementById('map');
    const options = {
      center: new kakao.maps.LatLng(lat, lon), 
      level: 3
    };
    const map = new kakao.maps.Map(container, options); //지도 생성

    var marker = new kakao.maps.Marker({  // 마커를 생성
        position: new kakao.maps.LatLng(lat, lon),  // 마커가 표시될 위치
    });
    marker.setMap(map); // 지도 위에 마커를 표출합니다

    //@@@@ 여기부터 카테고리 추가
    // 마커를 클릭했을 때 해당 장소의 상세정보를 보여줄 커스텀오버레이입니다 
    var placeOverlay = new kakao.maps.CustomOverlay({zIndex:1}),
    contentNode = document.createElement('div'), // 커스텀 오버레이의 컨텐츠 엘리먼트 입니다 
    markers = [], // 마커를 담을 배열입니다
    currCategory = ''; // 현재 선택된 카테고리를 가지고 있을 변수입니다

    var ps = new kakao.maps.services.Places(map); // 장소 검색 객체를 생성합니다
    kakao.maps.event.addListener(map, 'idle', searchPlaces);   // 지도에 idle 이벤트를 등록합니다
    contentNode.className = 'placeinfo_wrap'; // 커스텀 오버레이의 컨텐츠 노드에 css class를 추가합니다 
    addEventHandle(contentNode, 'mousedown', kakao.maps.event.preventMap);// 커스텀 오버레이의 컨텐츠 노드에 mousedown, touchstart 이벤트가 발생했을때
    addEventHandle(contentNode, 'touchstart', kakao.maps.event.preventMap);// 지도 객체에 이벤트가 전달되지 않도록 이벤트 핸들러로 kakao.maps.event.preventMap 메소드를 등록합니다
    placeOverlay.setContent(contentNode);  // 커스텀 오버레이 컨텐츠를 설정합니다
    addCategoryClickEvent();  // 각 카테고리에 클릭 이벤트를 등록합니다

    function addEventHandle(target, type, callback) { // 엘리먼트에 이벤트 핸들러를 등록하는 함수입니다
      if (target.addEventListener) {
          target.addEventListener(type, callback);
      } else {
          target.attachEvent('on' + type, callback);
      }
    }

    function searchPlaces() { // 카테고리 검색을 요청하는 함수입니다
      if (!currCategory) {
          return;
      }
      placeOverlay.setMap(null);  // 커스텀 오버레이를 숨깁니다 
      removeMarker(); // 지도에 표시되고 있는 마커를 제거합니다
      ps.categorySearch(currCategory, placesSearchCB, {useMapBounds:true}); 
    }

    function placesSearchCB(data, status, pagination) { // 장소검색이 완료됐을 때 호출되는 콜백함수 입니다
      if (status === kakao.maps.services.Status.OK) {
          displayPlaces(data);  // 정상적으로 검색이 완료됐으면 지도에 마커를 표출합니다
      } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
          // 검색결과가 없는경우 해야할 처리가 있다면 이곳에 작성해 주세요
      } else if (status === kakao.maps.services.Status.ERROR) {
          // 에러로 인해 검색결과가 나오지 않은 경우 해야할 처리가 있다면 이곳에 작성해 주세요
      }
    }

    function displayPlaces(places) {  // 지도에 마커를 표출하는 함수입니다
      // 몇번째 카테고리가 선택되어 있는지 얻어옵 니다
      // 이 순서는 스프라이트 이미지에서의 위치를 계산하는데 사용됩니다
      console.log(places)
      var order = document.getElementById(currCategory).getAttribute('data-order');
      for ( var i=0; i<places.length; i++ ) {
        var marker = addMarker(new kakao.maps.LatLng(places[i].y, places[i].x), order);// 마커를 생성하고 지도에 표시합니다
        // 마커와 검색결과 항목을 클릭 했을 때
        // 장소정보를 표출하도록 클릭 이벤트를 등록합니다
        (function(marker, place) {
          kakao.maps.event.addListener(marker, 'click', function() {displayPlaceInfo(place);});
        })(marker, places[i]);
      }
    }

    // 마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
    function addMarker(position, order) {
      var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/places_category.png', // 마커 이미지 url, 스프라이트 이미지를 씁니다
          imageSize = new kakao.maps.Size(27, 28),  // 마커 이미지의 크기
          imgOptions =  {
              spriteSize : new kakao.maps.Size(72, 208), // 스프라이트 이미지의 크기
              spriteOrigin : new kakao.maps.Point(46, (order*36)), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
              offset: new kakao.maps.Point(11, 28) // 마커 좌표에 일치시킬 이미지 내에서의 좌표
          },
          markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
              marker = new kakao.maps.Marker({
              position: position, // 마커의 위치
              image: markerImage 
          });

      marker.setMap(map); // 지도 위에 마커를 표출합니다
      markers.push(marker);  // 배열에 생성된 마커를 추가합니다

      return marker;
      }

    // 지도 위에 표시되고 있는 마커를 모두 제거합니다
    function removeMarker() {
      for ( var i = 0; i < markers.length; i++ ) {
          markers[i].setMap(null);
      }   
      markers = [];
    }

    function displayPlaceInfo (place) { // 클릭한 마커에 대한 장소 상세정보를 커스텀 오버레이로 표시하는 함수입니다
      var content = '<div class="placeinfo">' +
                      '<a class="title" href="' + place.place_url + '" target="_blank" title="' + place.place_name + '">' + place.place_name + '</a>';   
      if (place.road_address_name) {
        content += '<span title="' + place.road_address_name + '">' + place.road_address_name + '</span>' +
                      '<span class="jibun" title="' + place.address_name + '">(지번 : ' + place.address_name + ')</span>';
      }else {
        content += '<span title="' + place.address_name + '">' + place.address_name + '</span>';
      }                
      content += ' <span class="tel">' + place.phone + '</span>' + 
                  '</div>' + 
                  '<div class="after"></div>';
      contentNode.innerHTML = content;
      placeOverlay.setPosition(new kakao.maps.LatLng(place.y, place.x));
      placeOverlay.setMap(map);  
    }

    function addCategoryClickEvent() {  // 각 카테고리에 클릭 이벤트를 등록합니다
      var category = document.getElementById('category'),
          children = category.children;

      for (var i=0; i<children.length; i++) {
          children[i].onclick = onClickCategory;
      }
    }

    function onClickCategory() {  // 카테고리를 클릭했을 때 호출되는 함수입니다
      var id = this.id,
        className = this.className;
      placeOverlay.setMap(null);
      if(className === 'on') {
        currCategory = '';
        changeCategoryClass();
        removeMarker();
      }else{
        currCategory = id;
        changeCategoryClass(this);
        searchPlaces();
      }
    }

    function changeCategoryClass(el) {  // 클릭된 카테고리에만 클릭된 스타일을 적용하는 함수입니다
      var category = document.getElementById('category'),
          children = category.children,
          i;
      for ( i=0; i<children.length; i++ ) children[i].className = '';
      if (el) el.className = 'on';
    } 
    //@@@@@@@@@@@@@@@카테고리 끝
    },)
    return (
      <div className="map_wrap">
        <div id="map" style={{width:"100%",height:"100%",position:"relative",overflow:"hidden"}}></div>
        <ul id="category">
            <li id="BK9" data-order="0"> 
                <span className="category_bg bank"></span>
                은행
            </li>       
            <li id="MT1" data-order="1"> 
                <span className="category_bg mart"></span>
                마트
            </li>  
            <li id="PM9" data-order="2"> 
                <span className="category_bg pharmacy"></span>
                약국
            </li>  
            <li id="OL7" data-order="3"> 
                <span className="category_bg oil"></span>
                주유소
            </li>  
            <li id="CE7" data-order="4"> 
                <span className="category_bg cafe"></span>
                카페
            </li>  
            <li id="CS2" data-order="5"> 
                <span className="category_bg store"></span>
                편의점
            </li>      
        </ul> 
    </div>
    )
}
export default React.memo(Map);