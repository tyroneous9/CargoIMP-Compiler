
get storage fee

discuss whether it is valuable to create a new report view for the new feature:
create a new page with the following qualities:

email_xxx:
order is: carrier_flight_number, scheduled_arrival_date, mawb_number, has_rcf, has_nfd, has_dlv, has_arrival_notice, has_ready_for_pick_up, has_delivery_complete

office_operation:
1) AMS/Notes(trucking/skids$)/storage need to let us enter value
2) when it's after lfd time, highlight the entire row
3) P3/ISC need drop down menu
4) cargo delivery is the same as has_delivery_complete, if email was sent, archive the entire row or make it visible but unchangeable

office_operation:
- many of these features requires a save feature, consider also handling the processing status w/ this feature (archived roles disappear OR are filtered out OR sorted by new first by default)
- 3 columns which are empty by default, but the user can write to them: AMS, Notes, Storage
- once the current date is past the LFD date, highlight the row (purely visual, should be minimal)
- P3: true/false, ISC: TOLEAD,NCA,STORAGE,VFY_REQ

office_operation order:
carrier_flight_number, actual_arrival_datetime, last_free_day, mawb_number, hawb_number, weight (of the mawb), total pieces (of the mawb), uld_code, consignee, ams_status, p3, freight_charge, storage, ISC, has_delivery_complete


New message type verification:
RCF_[mawb]
Delivery Complete_[mawb]
Ready for Pick Up_[mawb]
DLV_[mawb]
NFD_[mawb]

Examples:
RCF_933-34474602
Delivery Complete_205-33676484
Ready for Pick Up_933-34771542
DLV_205-33676484
NFD_933-34771542

breakdown_manifest:
mawb_number, hawb_number, piece count of mawb, uld_code
the table should be keyed on mawb_number, therefore hawb_number and uld_code should be a list of all hawb/uld associated with the mawb