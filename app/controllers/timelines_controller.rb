require 'json'

class TimelinesController < ApplicationController
  protect_from_forgery except: :index
  protect_from_forgery except: :create
  protect_from_forgery except: :update
  protect_from_forgery except: :destroy

  before_action :set_timeline, only: [:show, :edit, :update, :destroy]

  # GET /timelines
  # GET /timelines.json
  #GET /timelines.xml
  def index
    @timelines = Timeline.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render xml: @timelines }
      format.json { render json: @timelines }
    end
  end

  # GET /timelines/1
  # GET /timelines/1.json
  # GET /timelines/1.xml
  def show
    @timeline = Timeline.find(params[:id])

    eevents = @timeline.events

    date = []
    eevents.each do |event|
      date_element = {}
      date_element["startDate"] = "2011,12,10"
      date_element["headline"] = event.description
      date_element["text"] = event.description
      date_element["asset"] = {}
      date_element["asset"]["media"] = ""
      date_element["asset"]["credit"] = ""
      date_element["asset"]["caption"] = ""
      date.push(date_element)
    end

    @timelines = {}
    @timelines["headline"] = @timeline.description
    @timelines["type"] = "default"
    @timelines["text"] = @timeline.description

    @timelines["startDate"] = "2011,12,02"
    @timelines["date"] = date

    upper = {}
    upper["timeline"] = @timelines

    @timelines = upper.to_json
    file_path = "./app/assets/javascripts/example_json.json"
    f = File.open(File.expand_path(file_path), "w")
    f.puts(@timelines)
    f.close

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render xml: @timeline }
      format.json { render json: @timeline }
    end
  end

  # GET /timelines/new
  def new
    @timeline = Timeline.new
  end

  # GET /timelines/1/edit
  def edit
  end

  # POST /timelines
  # POST /timelines.json
  def create
    @timeline = Timeline.new(timeline_params)

    respond_to do |format|
      if @timeline.save
        format.html { redirect_to @timeline, notice: 'Timeline was successfully created.' }
        format.json { render action: 'show', status: :created, location: @timeline }
        format.xml  { render xml: @timeline }
      else
        format.html { render action: 'new' }
        format.json { render json: @timeline.errors, status: :unprocessable_entity }
        format.xml  { render xml: @timeline }
      end
    end
  end

  # PATCH/PUT /timelines/1
  # PATCH/PUT /timelines/1.json
  def update
    respond_to do |format|
      if @timeline.update(timeline_params)
        format.html { redirect_to @timeline, notice: 'Timeline was successfully updated.' }
        format.json { head :no_content }
        format.xml  { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @timeline.errors, status: :unprocessable_entity }
        format.xml  { render xml: @timeline }
      end
    end
  end

  # DELETE /timelines/1
  # DELETE /timelines/1.json
  def destroy
    @timeline.destroy
    respond_to do |format|
      format.html { redirect_to timelines_url }
      format.json { head :no_content }
      format.xml { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_timeline
      @timeline = Timeline.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def timeline_params
      params.require(:timeline).permit(:description, :published, :genre)
    end
end
