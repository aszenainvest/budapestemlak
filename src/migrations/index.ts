import * as migration_20260424_115613_add_timeline_icon_column_only from './20260424_115613_add_timeline_icon_column_only';
import * as migration_20260429_190212_add_video_block from './20260429_190212_add_video_block';
import * as migration_20260525_104322_add_status_labels_and_archive_properties from './20260525_104322_add_status_labels_and_archive_properties';
import * as migration_20260525_125610_add_categories_to_properties from './20260525_125610_add_categories_to_properties';
import * as migration_20260525_135508_add_type_to_categories from './20260525_135508_add_type_to_categories';
import * as migration_20260525_151959_add_property_archive_block from './20260525_151959_add_property_archive_block';
import * as migration_20260614_property_status_label_presets from './20260614_property_status_label_presets';
import * as migration_20260602_194400_add_file_hash_to_media from './20260602_194400_add_file_hash_to_media';
import * as migration_20260604_botim_imo_messenger_buttons from './20260604_botim_imo_messenger_buttons';
import * as migration_20260604_property_archive_display_mode from './20260604_property_archive_display_mode';
import * as migration_20260624_properties_publish_all from './20260624_properties_publish_all';
import * as migration_20260705_properties_backfill_published from './20260705_properties_backfill_published';
import * as migration_20260705_220000_properties_cleanup_orphans from './20260705_220000_properties_cleanup_orphans';

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
  {
    up: migration_20260602_194400_add_file_hash_to_media.up,
    down: migration_20260602_194400_add_file_hash_to_media.down,
    name: '20260602_194400_add_file_hash_to_media',
  },
  {
    up: migration_20260604_botim_imo_messenger_buttons.up,
    down: migration_20260604_botim_imo_messenger_buttons.down,
    name: '20260604_botim_imo_messenger_buttons',
  },
  {
    up: migration_20260604_property_archive_display_mode.up,
    down: migration_20260604_property_archive_display_mode.down,
    name: '20260604_property_archive_display_mode',
  },
  {
    up: migration_20260624_properties_publish_all.up,
    down: migration_20260624_properties_publish_all.down,
    name: '20260624_properties_publish_all',
  },
  {
    up: migration_20260705_properties_backfill_published.up,
    down: migration_20260705_properties_backfill_published.down,
    name: '20260705_properties_backfill_published',
  },
  {
    up: migration_20260705_220000_properties_cleanup_orphans.up,
    down: migration_20260705_220000_properties_cleanup_orphans.down,
    name: '20260705_220000_properties_cleanup_orphans',
  },
];
