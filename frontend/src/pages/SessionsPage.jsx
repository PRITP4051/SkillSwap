import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { resolveImageUrl } from '../lib/api';
import SessionCard from '../components/SessionCard';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Star, Upload, QrCode } from 'lucide-react';

const TABS = ['upcoming', 'pending action', 'completed', 'cancelled'];

const filterSessions = (sessions, tab) => {
  switch (tab) {
    case 'upcoming':
      return sessions.filter((s) => ['pending', 'confirmed'].includes(s.status));
    case 'pending action':
      return sessions.filter((s) => s.status === 'pending_completion');
    case 'completed':  return sessions.filter((s) => s.status === 'completed');
    case 'cancelled':  return sessions.filter((s) => s.status === 'cancelled');
    default:           return sessions;
  }
};

const SessionsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [tab, setTab]             = useState('upcoming');

  // ── Accept modal (teacher) ──────────────────────────────────────────────────
  const [confirmingSessionId, setConfirmingSessionId]   = useState(null);
  const [meetingForm, setMeetingForm]                   = useState({ contactNumber: '', meetingLink: '' });
  const [qrFile, setQrFile]                             = useState(null);
  const [submittingApproval, setSubmittingApproval]     = useState(false);
  const qrInputRef = useRef(null);

  // ── Review modal ────────────────────────────────────────────────────────────
  const [reviewedSessionIds, setReviewedSessionIds]     = useState([]);
  const [reviewingSession, setReviewingSession]         = useState(null);
  const [reviewForm, setReviewForm]                     = useState({ rating: 0, comment: '' });
  const [submittingReview, setSubmittingReview]         = useState(false);

  // ── Payment upload modal (learner) ──────────────────────────────────────────
  const [payingSession, setPayingSession]               = useState(null);
  const [screenshotFile, setScreenshotFile]             = useState(null);
  const [submittingPayment, setSubmittingPayment]       = useState(false);
  const screenshotInputRef = useRef(null);

  const fetchSessions = useCallback(async () => {
    try {
      const [sessionsRes, reviewsRes] = await Promise.all([
        api.get('/sessions/my'),
        api.get('/reviews/my'),
      ]);
      if (sessionsRes.data.success) setSessions(sessionsRes.data.data);
      if (reviewsRes.data.success) {
        setReviewedSessionIds(reviewsRes.data.data.map((r) => r.session.toString()));
      }
    } catch {
      toast.error('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSessions(); }, [fetchSessions]);

  // ── Accept modal ─────────────────────────────────────────────────────────────
  const openApproveModal = (sessionId) => {
    setConfirmingSessionId(sessionId);
    setMeetingForm({ contactNumber: '', meetingLink: '' });
    setQrFile(null);
  };

  const closeApproveModal = () => {
    if (submittingApproval) return;
    setConfirmingSessionId(null);
    setMeetingForm({ contactNumber: '', meetingLink: '' });
    setQrFile(null);
  };

  const submitApproval = async (e) => {
    e.preventDefault();
    if (!confirmingSessionId) return;

    const trimmedContact = meetingForm.contactNumber.trim();
    const trimmedLink    = meetingForm.meetingLink.trim();

    if (!trimmedContact || !trimmedLink) {
      toast.error('Mobile number and meeting link are required');
      return;
    }
    if (!qrFile) {
      toast.error('Payment QR image is required');
      return;
    }

    setSubmittingApproval(true);
    try {
      const formData = new FormData();
      formData.append('status', 'confirmed');
      formData.append('contactNumber', trimmedContact);
      formData.append('meetingLink', trimmedLink);
      formData.append('paymentQR', qrFile);

      const { data } = await api.put(`/sessions/${confirmingSessionId}/status`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (data.success) {
        setSessions((cur) => cur.map((s) => (s._id === confirmingSessionId ? data.data : s)));
        toast.success('Session accepted & QR saved');
        closeApproveModal();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to accept session');
    } finally {
      setSubmittingApproval(false);
    }
  };

  // ── Reject ───────────────────────────────────────────────────────────────────
  const handleReject = async (sessionId) => {
    if (!window.confirm('Are you sure you want to reject this booking?')) return;
    try {
      const formData = new FormData();
      formData.append('status', 'cancelled');
      const { data } = await api.put(`/sessions/${sessionId}/status`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (data.success) {
        setSessions((cur) => cur.map((s) => (s._id === sessionId ? data.data : s)));
        toast.success('Session rejected');
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update session');
    }
  };

  // ── Mark Completed / Cancelled (pending_completion) ──────────────────────────
  const handleMarkCompleted = async (sessionId) => {
    if (!window.confirm('Mark this session as completed?')) return;
    try {
      const formData = new FormData();
      formData.append('status', 'completed');
      const { data } = await api.put(`/sessions/${sessionId}/status`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (data.success) {
        setSessions((cur) => cur.map((s) => (s._id === sessionId ? data.data : s)));
        toast.success('Session marked as completed');
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update session');
    }
  };

  const handleMarkCancelled = async (sessionId) => {
    if (!window.confirm('Cancel this session?')) return;
    try {
      const formData = new FormData();
      formData.append('status', 'cancelled');
      const { data } = await api.put(`/sessions/${sessionId}/status`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (data.success) {
        setSessions((cur) => cur.map((s) => (s._id === sessionId ? data.data : s)));
        toast.success('Session cancelled');
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update session');
    }
  };

  // ── Chat ─────────────────────────────────────────────────────────────────────
  const handleChat = (session) => {
    navigate('/chat', { state: { roomId: session.roomId } });
  };

  // ── Payment upload (learner) ──────────────────────────────────────────────────
  const openPaymentModal = (session) => {
    setPayingSession(session);
    setScreenshotFile(null);
  };

  const closePaymentModal = () => {
    if (submittingPayment) return;
    setPayingSession(null);
    setScreenshotFile(null);
  };

  const submitPayment = async (e) => {
    e.preventDefault();
    if (!payingSession || !screenshotFile) {
      toast.error('Please select a screenshot to upload');
      return;
    }
    setSubmittingPayment(true);
    try {
      const formData = new FormData();
      formData.append('paymentScreenshot', screenshotFile);
      const { data } = await api.post(`/sessions/${payingSession._id}/payment`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (data.success) {
        setSessions((cur) => cur.map((s) => (s._id === payingSession._id ? data.data : s)));
        toast.success('Payment screenshot submitted!');
        closePaymentModal();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit payment');
    } finally {
      setSubmittingPayment(false);
    }
  };

  // ── Verify Payment (teacher) ──────────────────────────────────────────────────
  const handleVerifyPayment = async (sessionId, action) => {
    const label = action === 'accept' ? 'verify' : 'reject';
    if (!window.confirm(`Are you sure you want to ${label} this payment?`)) return;
    try {
      const { data } = await api.put(`/sessions/${sessionId}/verify-payment`, { action });
      if (data.success) {
        setSessions((cur) => cur.map((s) => (s._id === sessionId ? data.data : s)));
        toast.success(action === 'accept' ? 'Payment verified ✅' : 'Payment rejected');
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update payment');
    }
  };

  // ── Review modal ─────────────────────────────────────────────────────────────
  const openReviewModal = (session) => {
    setReviewingSession(session);
    setReviewForm({ rating: 0, comment: '' });
  };

  const closeReviewModal = () => {
    if (submittingReview) return;
    setReviewingSession(null);
    setReviewForm({ rating: 0, comment: '' });
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!reviewingSession) return;
    if (reviewForm.rating < 1 || reviewForm.rating > 5) {
      toast.error('Please select a rating from 1 to 5');
      return;
    }
    setSubmittingReview(true);
    try {
      const { data } = await api.post('/reviews', {
        sessionId: reviewingSession._id,
        revieweeId: reviewingSession.teacher?._id,
        rating: reviewForm.rating,
        comment: reviewForm.comment.trim(),
      });
      if (data.success) {
        setReviewedSessionIds((cur) => [...cur, reviewingSession._id]);
        toast.success('Review submitted');
        closeReviewModal();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const displayed = filterSessions(sessions, tab);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <h1 style={{ margin: '0 0 1.5rem', fontSize: '1.5rem', fontWeight: 800, color: '#f1f5f9' }}>My Sessions</h1>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: '1.5rem', background: 'rgba(30,41,59,0.5)', borderRadius: 12, padding: 4 }}>
        {TABS.map((t) => {
          const count = filterSessions(sessions, t).length;
          const label = t.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
          return (
            <button key={t} onClick={() => setTab(t)}
              style={{
                flex: 1, padding: '0.5rem', border: 'none', borderRadius: 9, cursor: 'pointer',
                fontFamily: 'DM Sans,sans-serif', fontWeight: 600, fontSize: '0.875rem',
                transition: 'all 0.2s',
                background: tab === t ? 'rgba(6,182,212,0.15)' : 'transparent',
                color: tab === t ? '#06b6d4' : '#64748b',
              }}>
              {label} {count > 0 && `(${count})`}
            </button>
          );
        })}
      </div>

      {loading ? <LoadingSpinner /> : (
        displayed.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.1rem' }}>
            {displayed.map((s) => (
              <SessionCard
                key={s._id}
                session={s}
                currentUserId={user?._id}
                onAccept={openApproveModal}
                onReject={handleReject}
                onChat={handleChat}
                onMarkCompleted={handleMarkCompleted}
                onMarkCancelled={handleMarkCancelled}
                onSubmitPayment={openPaymentModal}
                onVerifyPayment={handleVerifyPayment}
                canLeaveReview={
                  tab === 'completed' &&
                  s.status === 'completed' &&
                  s.paymentStatus === 'verified' &&
                  s.learner?._id?.toString() === user?._id &&
                  !reviewedSessionIds.includes(s._id)
                }
                onLeaveReview={openReviewModal}
              />
            ))}
          </div>
        ) : (
          <div className="glass" style={{ padding: '4rem', textAlign: 'center' }}>
            <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
              {tab === 'upcoming' ? '📅' : tab === 'completed' ? '✅' : tab === 'pending action' ? '⏳' : '❌'}
            </p>
            <p style={{ color: '#64748b' }}>No {tab} sessions</p>
            {tab === 'upcoming' && (
              <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/explore')}>
                Find a Teacher
              </button>
            )}
          </div>
        )
      )}

      {/* ── Accept/Confirm Modal ─────────────────────────────────────────────── */}
      {confirmingSessionId && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.75)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 40 }}
          onClick={closeApproveModal}>
          <div className="glass" style={{ width: '100%', maxWidth: 480, padding: '1.5rem' }}
            onClick={(e) => e.stopPropagation()}>
            <h2 style={{ margin: '0 0 0.5rem', color: '#f1f5f9', fontSize: '1.25rem', fontWeight: 800 }}>Confirm Session</h2>
            <p style={{ margin: '0 0 1rem', color: '#94a3b8', lineHeight: 1.6 }}>
              Share your mobile number, meeting link, and payment QR so the learner can prepare.
            </p>
            <form onSubmit={submitApproval}>
              <div style={{ marginBottom: '1rem' }}>
                <label className="label">Mobile Number</label>
                <input className="input" type="text" value={meetingForm.contactNumber}
                  onChange={(e) => setMeetingForm((c) => ({ ...c, contactNumber: e.target.value }))}
                  placeholder="e.g. +91 98765 43210" />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label className="label">Zoom / Meet Link</label>
                <input className="input" type="url" value={meetingForm.meetingLink}
                  onChange={(e) => setMeetingForm((c) => ({ ...c, meetingLink: e.target.value }))}
                  placeholder="https://meet.google.com/..." />
              </div>
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="label">Payment QR Code <span style={{ color: '#06b6d4' }}>*</span></label>
                <div
                  style={{
                    border: `2px dashed ${qrFile ? 'rgba(6,182,212,0.5)' : 'rgba(100,116,139,0.3)'}`,
                    borderRadius: 12, padding: '1rem', textAlign: 'center', cursor: 'pointer',
                    transition: 'border-color 0.2s',
                  }}
                  onClick={() => qrInputRef.current?.click()}>
                  {qrFile ? (
                    <>
                      <img src={URL.createObjectURL(qrFile)} alt="QR Preview"
                        style={{ maxHeight: 140, maxWidth: '100%', borderRadius: 8, display: 'block', margin: '0 auto 0.5rem' }} />
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#06b6d4' }}>{qrFile.name}</p>
                    </>
                  ) : (
                    <>
                      <QrCode size={32} color="#64748b" style={{ marginBottom: '0.5rem' }} />
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Click to upload QR image</p>
                    </>
                  )}
                </div>
                <input ref={qrInputRef} type="file" accept="image/*" style={{ display: 'none' }}
                  onChange={(e) => setQrFile(e.target.files[0] || null)} />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="submit" className="btn-primary" disabled={submittingApproval} style={{ flex: 1, justifyContent: 'center' }}>
                  {submittingApproval ? 'Saving...' : 'Accept Session'}
                </button>
                <button type="button" className="btn-ghost" disabled={submittingApproval} onClick={closeApproveModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Payment Upload Modal (learner) ───────────────────────────────────── */}
      {payingSession && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.75)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 40 }}
          onClick={closePaymentModal}>
          <div className="glass" style={{ width: '100%', maxWidth: 460, padding: '1.5rem' }}
            onClick={(e) => e.stopPropagation()}>
            <h2 style={{ margin: '0 0 0.5rem', color: '#f1f5f9', fontSize: '1.25rem', fontWeight: 800 }}>Submit Payment</h2>
            <p style={{ margin: '0 0 0.75rem', color: '#94a3b8', lineHeight: 1.6 }}>
              Scan the teacher's QR code, pay, then upload a screenshot below.
            </p>
            {payingSession.paymentQR && (
              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <img src={resolveImageUrl(payingSession.paymentQR)} alt="Teacher QR"
                  style={{ maxWidth: 180, maxHeight: 180, borderRadius: 10, border: '1px solid rgba(6,182,212,0.3)' }} />
              </div>
            )}
            <form onSubmit={submitPayment}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="label">Upload Payment Screenshot <span style={{ color: '#06b6d4' }}>*</span></label>
                <div
                  style={{
                    border: `2px dashed ${screenshotFile ? 'rgba(6,182,212,0.5)' : 'rgba(100,116,139,0.3)'}`,
                    borderRadius: 12, padding: '1rem', textAlign: 'center', cursor: 'pointer',
                    transition: 'border-color 0.2s',
                  }}
                  onClick={() => screenshotInputRef.current?.click()}>
                  {screenshotFile ? (
                    <>
                      <img src={URL.createObjectURL(screenshotFile)} alt="Screenshot Preview"
                        style={{ maxHeight: 140, maxWidth: '100%', borderRadius: 8, display: 'block', margin: '0 auto 0.5rem' }} />
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#06b6d4' }}>{screenshotFile.name}</p>
                    </>
                  ) : (
                    <>
                      <Upload size={32} color="#64748b" style={{ marginBottom: '0.5rem' }} />
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Click to upload screenshot</p>
                    </>
                  )}
                </div>
                <input ref={screenshotInputRef} type="file" accept="image/*" style={{ display: 'none' }}
                  onChange={(e) => setScreenshotFile(e.target.files[0] || null)} />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="submit" className="btn-primary" disabled={submittingPayment} style={{ flex: 1, justifyContent: 'center' }}>
                  {submittingPayment ? 'Uploading...' : 'Submit Payment'}
                </button>
                <button type="button" className="btn-ghost" disabled={submittingPayment} onClick={closePaymentModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Review Modal ─────────────────────────────────────────────────────── */}
      {reviewingSession && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.75)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 40 }}
          onClick={closeReviewModal}>
          <div className="glass" style={{ width: '100%', maxWidth: 460, padding: '1.5rem' }}
            onClick={(e) => e.stopPropagation()}>
            <h2 style={{ margin: '0 0 0.5rem', color: '#f1f5f9', fontSize: '1.25rem', fontWeight: 800 }}>Leave Review</h2>
            <p style={{ margin: '0 0 1rem', color: '#94a3b8', lineHeight: 1.6 }}>
              Share a rating for your completed session with {reviewingSession.teacher?.name}.
            </p>
            <form onSubmit={submitReview}>
              <div style={{ marginBottom: '1rem' }}>
                <label className="label">Rating</label>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button key={value} type="button"
                      onClick={() => setReviewForm((c) => ({ ...c, rating: value }))}
                      style={{
                        width: 44, height: 44, borderRadius: 12, cursor: 'pointer',
                        border: reviewForm.rating >= value ? '1px solid rgba(251,191,36,0.55)' : '1px solid rgba(148,163,184,0.2)',
                        background: reviewForm.rating >= value ? 'rgba(251,191,36,0.15)' : 'rgba(15,23,42,0.35)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                      <Star size={18}
                        color={reviewForm.rating >= value ? '#fbbf24' : '#64748b'}
                        fill={reviewForm.rating >= value ? '#fbbf24' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="label">Comment</label>
                <textarea className="input" rows={4} value={reviewForm.comment}
                  onChange={(e) => setReviewForm((c) => ({ ...c, comment: e.target.value }))}
                  placeholder="What went well in the session?" style={{ resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="submit" className="btn-primary" disabled={submittingReview} style={{ flex: 1, justifyContent: 'center' }}>
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
                <button type="button" className="btn-ghost" disabled={submittingReview} onClick={closeReviewModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionsPage;
