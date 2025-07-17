import React from "react";  
import myVideo from "../assets/video.mp4";


function VideoComponent() {
    return (
     <div className='video_wrap'>
        <video 
         src={myVideo} 
         autoPlay
         muted
         loop
         className="background_video">
               
        </video>
     </div>
    ); 
}      
export default VideoComponent;
