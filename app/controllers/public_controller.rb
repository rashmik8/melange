class PublicController < ApplicationController
  def home
    @timelines = []
    @timelines = Timeline.find(:all, :conditions => ["published = ? AND featured_type = ?" ,"true", "featured"])
  end

  def showcase
    @timelines = {}
    @timelines["Music"] = Timeline.find(:all, :conditions => ["genre = ?", "music"])
    @timelines["Technology"] = Timeline.find(:all, :conditions => ["genre = ?", "technology"])
    @timelines["Movie"] = Timeline.find(:all, :conditions => ["genre = ?", "movie"])
  end

  def new_timeline
  end

  def faq
  end

  def browse
    @timelines = []
    @timelines = Timeline.find(:all, :conditions => ["published = ?", "true"])
    if user_signed_in?
      @timelines << Timeline.find(:all, :conditions => ["published = ? AND user_id = ?", "false", current_user.id])
      @timelines = @timelines.flatten
    end
  end

  def preview
    @timelines = Timeline.find(:all, :conditions => ["published = ?", "true"])
    if user_signed_in?
      @timelines << Timeline.find(:all, :conditions => ["published = ? AND user_id = ?", "false", current_user.id])
      @timelines = @timelines.flatten
    end
    respond_to do |format|
      format.html #responds with default html file
      format.js {render :layout=>false, :locals => {:timeline => @timelines}} #this will be the javascript file we respond with
    end
  end

end
