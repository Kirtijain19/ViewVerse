import { useState } from "react";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import { publishVideo } from "../services/videoService.js";

const Upload = () => {
  const [form, setForm] = useState({ title: "", description: "" });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [status, setStatus] = useState("");

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("");
    const payload = new FormData();
    payload.append("title", form.title);
    payload.append("description", form.description);
    if (videoFile) payload.append("videoFile", videoFile);
    if (thumbnail) payload.append("thumbnail", thumbnail);

    try {
      await publishVideo(payload);
      setStatus("Video uploaded successfully.");
      setForm({ title: "", description: "" });
      setVideoFile(null);
      setThumbnail(null);
    } catch (error) {
      setStatus(error?.response?.data?.message || "Upload failed.");
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="rounded-3xl border border-slate-900 bg-slate-900/60 p-8">
        <h1 className="text-2xl font-semibold">Upload a new video</h1>
        <p className="mt-2 text-sm text-slate-400">Share your latest content with ViewVerse.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input name="title" value={form.title} onChange={handleChange} placeholder="Video title" />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Video description"
            rows={4}
            className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-400">
              Video file
              <input
                type="file"
                accept="video/*"
                onChange={(event) => setVideoFile(event.target.files?.[0])}
                className="block w-full rounded-xl border border-slate-800 bg-slate-900 p-2 text-xs text-slate-300"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-400">
              Thumbnail
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setThumbnail(event.target.files?.[0])}
                className="block w-full rounded-xl border border-slate-800 bg-slate-900 p-2 text-xs text-slate-300"
              />
            </label>
          </div>
          {status && <p className="text-sm text-slate-400">{status}</p>}
          <Button type="submit">Publish</Button>
        </form>
      </div>
    </div>
  );
};

export default Upload;
