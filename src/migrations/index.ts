import * as migration_20260424_115613_add_timeline_icon_column_only from './20260424_115613_add_timeline_icon_column_only';
import * as migration_20260429_190212_add_video_block from './20260429_190212_add_video_block';
import * as migration_20260525_104322_add_status_labels_and_archive_properties from './20260525_104322_add_status_labels_and_archive_properties';
import * as migration_20260525_125610_add_categories_to_properties from './20260525_125610_add_categories_to_properties';
import * as migration_20260525_135508_add_type_to_categories from './20260525_135508_add_type_to_categories';
import * as migration_20260525_151959_add_property_archive_block from './20260525_151959_add_property_archive_block';
import * as migration_20260614_property_status_label_presets from './20260614_property_status_label_presets';

export const migrations = [
  {
    up: migration_20260424_115613_add_timeline_icon_column_only.up,
    down: migration_20260424_115613_add_timeline_icon_column_only.down,
    name: '20260424_115613_add_timeline_icon_column_only',
  },
  {
    up: migration_20260429_190212_add_video_block.up,
    down: migration_20260429_190212_add_video_block.down,
    name: '20260429_190212_add_video_block',
  },
  {
    up: migration_20260525_104322_add_status_labels_and_archive_properties.up,
    down: migration_20260525_104322_add_status_labels_and_archive_properties.down,
    name: '20260525_104322_add_status_labels_and_archive_properties',
  },
  {
    up: migration_20260525_125610_add_categories_to_properties.up,
    down: migration_20260525_125610_add_categories_to_properties.down,
    name: '20260525_125610_add_categories_to_properties',
  },
  {
    up: migration_20260525_135508_add_type_to_categories.up,
    down: migration_20260525_135508_add_type_to_categories.down,
    name: '20260525_135508_add_type_to_categories',
  },
  {
    up: migration_20260525_151959_add_property_archive_block.up,
    down: migration_20260525_151959_add_property_archive_block.down,
    name: '20260525_151959_add_property_archive_block'
  },
  {
    up: migration_20260614_property_status_label_presets.up,
    down: migration_20260614_property_status_label_presets.down,
    name: '20260614_property_status_label_presets',
  },
];
