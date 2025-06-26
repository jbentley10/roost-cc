export function VideoPlayer({ video }: { video: any }) {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      {(video.title || video.description) && (
        <div className="container px-4 md:px-6">
          {video.title && (
            <h2 className="text-3xl text-center mb-12 font-display">{video.title}</h2>
          )}
          {video.description && (
            <p className="text-gray-600">{video.description}</p>
          )}
        </div>
      )}
      <video
        src={video.url}
        controls
        style={{
          width: 500,
          height: 500,
          margin: '0 auto'
        }}
        aria-label={video.title || "Video player"}
      >
        Your browser does not support the video tag.
      </video>
    </section>
  );
}