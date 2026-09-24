export default {
  name: 'audioConfig',
  title: 'Cài đặt Nhạc nền',
  type: 'document',
  fields: [
    { name: 'title', title: 'Tên bài hát', type: 'string' },
    { name: 'musicFile', title: 'File nhạc (mp3)', type: 'file' },
    { 
      name: 'volume', 
      title: 'Âm lượng mặc định (0.1 đến 1.0)', 
      type: 'number', 
      validation: Rule => Rule.min(0).max(1) 
    }
  ]
}