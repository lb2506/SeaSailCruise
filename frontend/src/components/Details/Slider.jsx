import React from 'react'

import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


// import required modules
import { Navigation, Pagination } from "swiper";

export default function Slider({ product }) {
    if (product.carousel) {
        return (
            <>
                <Swiper
                    slidesPerView={4.5}
                    spaceBetween={10}
                    loop={true}
                    pagination={{
                        clickable: true
                    }}
                    navigation={true}
                    modules={[Navigation, Pagination]}
                    className="mySwiper"
                >
                    {product.carousel.map((image, index) => (
                        <SwiperSlide key={index}>
                            <img src={image.url} alt='boat' />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </>
        );
    } else {
        return null
    }
}
