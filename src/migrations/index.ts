import * as migration_20260424_115613_add_timeline_icon_column_only from './20260424_115613_add_timeline_icon_column_only';
import * as migration_20260429_190212_add_video_block from './20260429_190212_add_video_block';

export const migrations = [
  {
    up: migration_20260424_115613_add_timeline_icon_column_only.up,
    down: migration_20260424_115613_add_timeline_icon_column_only.down,
    name: '20260424_115613_add_timeline_icon_column_only',
  },
  {
    up: migration_20260429_190212_add_video_block.up,
    down: migration_20260429_190212_add_video_block.down,
    name: '20260429_190212_add_video_block'
  },
];
