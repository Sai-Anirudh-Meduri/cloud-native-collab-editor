import type { MigrationBuilder } from 'node-pg-migrate'

export const up = (pgm: MigrationBuilder) => {
  pgm.createTable('documents', {
    id: {
      type: 'uuid',
      primaryKey: true,
    },

    owner_id: {
      type: 'text',
      notNull: true,
      references: '"user"',
      onDelete: 'CASCADE',
    },

    title: {
      type: 'text',
      notNull: true,
    },

    content: {
      type: 'text',
      notNull: true,
      default: '',
    },

    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP'),
    },

    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
  })

  pgm.createIndex('documents', 'owner_id')
}

export const down = (pgm: MigrationBuilder) => {
  pgm.dropTable('documents')
}
