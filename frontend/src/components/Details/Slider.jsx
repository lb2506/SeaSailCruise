import React from 'react'

import { Swiper, SwiperSlide } from 'swiper/react/swiper-react'

import 'swiper/swiper.min.css'
import 'swiper/modules/pagination/pagination.min.css'
import "swiper/modules/navigation/navigation.min.css";


// import required modules
import { Navigation, Pagination } from "swiper";

export default function Slider({product}) {
    if(product.carousel1 && product.carousel2 && product.carousel3){
        return (
            <>
            <Swiper
                slidesPerView={3}
                spaceBetween={10}
                loop={true}
                pagination={{
                clickable: true
                }}
                navigation={true}
                modules={[Navigation, Pagination]}
                className="mySwiper"
            >
                <SwiperSlide><img src={product.carousel1.url}/></SwiperSlide>
                <SwiperSlide><img src={product.carousel2.url}/></SwiperSlide>
                <SwiperSlide><img src={product.carousel3.url}/></SwiperSlide>
            </Swiper>
            </>
        );
    } else {
        return null
    }
}
