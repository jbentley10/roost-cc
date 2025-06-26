export function VideoPlayer(video: any) {
  console.log(video);
  return (
    <div className="w-full">
      <video
        src={video.url}
        controls
        className="w-full h-auto"
        aria-label={video.title || "Video player"}
      >
        Your browser does not support the video tag.
      </video>
      {(video.title || video.description) && (
        <div className="mt-2">
          {video.title && (
            <h3 className="text-lg font-semibold">{video.title}</h3>
          )}
          {video.description && (
            <p className="text-gray-600">{video.description}</p>
          )}
        </div>
      )}
    </div>
  );
}
