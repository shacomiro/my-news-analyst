"""Alter result_content to text

Revision ID: 032fa895c235
Revises: 3908d4d02da3
Create Date: 2025-06-19 15:50:03.447779

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '032fa895c235'
down_revision = '3908d4d02da3'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('analysis_results', schema=None) as batch_op:
        batch_op.alter_column('result_content',
               existing_type=postgresql.JSON(astext_type=sa.Text()),
               type_=sa.Text(),
               existing_nullable=True)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('analysis_results', schema=None) as batch_op:
        batch_op.alter_column('result_content',
               existing_type=sa.Text(),
               type_=postgresql.JSON(astext_type=sa.Text()),
               existing_nullable=True)

    # ### end Alembic commands ###
