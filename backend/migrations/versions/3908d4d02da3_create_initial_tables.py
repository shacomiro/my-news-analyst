"""Create initial tables

Revision ID: 3908d4d02da3
Revises: 
Create Date: 2025-06-16 22:00:51.575984

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3908d4d02da3'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('news_articles',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(length=500), nullable=False),
    sa.Column('link', sa.String(length=500), nullable=False),
    sa.Column('publisher', sa.String(length=100), nullable=True),
    sa.Column('pub_date', sa.DateTime(), nullable=True),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('crawled_at', sa.DateTime(), nullable=False),
    sa.Column('original_json', sa.JSON(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('link')
    )
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('email', sa.String(length=255), nullable=False),
    sa.Column('password_hash', sa.String(length=255), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('last_login_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    op.create_table('search_histories',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('keyword', sa.String(length=255), nullable=False),
    sa.Column('searched_at', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('analysis_results',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('search_history_id', sa.Integer(), nullable=False),
    sa.Column('analysis_type', sa.String(length=50), nullable=False),
    sa.Column('requested_at', sa.DateTime(), nullable=False),
    sa.Column('completed_at', sa.DateTime(), nullable=True),
    sa.Column('result_content', sa.JSON(), nullable=True),
    sa.Column('status', sa.String(length=20), nullable=False),
    sa.ForeignKeyConstraint(['search_history_id'], ['search_histories.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('search_history_news_articles',
    sa.Column('search_history_id', sa.Integer(), nullable=False),
    sa.Column('news_article_id', sa.Integer(), nullable=False),
    sa.Column('order_in_search', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['news_article_id'], ['news_articles.id'], ),
    sa.ForeignKeyConstraint(['search_history_id'], ['search_histories.id'], ),
    sa.PrimaryKeyConstraint('search_history_id', 'news_article_id')
    )
    op.create_table('analysis_result_news_articles',
    sa.Column('analysis_result_id', sa.Integer(), nullable=False),
    sa.Column('news_article_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['analysis_result_id'], ['analysis_results.id'], ),
    sa.ForeignKeyConstraint(['news_article_id'], ['news_articles.id'], ),
    sa.PrimaryKeyConstraint('analysis_result_id', 'news_article_id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('analysis_result_news_articles')
    op.drop_table('search_history_news_articles')
    op.drop_table('analysis_results')
    op.drop_table('search_histories')
    op.drop_table('users')
    op.drop_table('news_articles')
    # ### end Alembic commands ###
