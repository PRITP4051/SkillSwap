import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import {
  Calendar, CheckCircle2, Clock, IndianRupee, Link as LinkIcon,
  MessageSquare, Phone, Star, XCircle, GraduationCap,
  QrCode, Upload, ShieldCheck, ShieldX, Hourglass,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AvatarImage from './AvatarImage';
import { resolveImageUrl } from '../lib/api';

const statusClass = {
  pending: 'badge-pending',
  confirmed: 'badge-confirmed',
  pending_completion: 'badge-pending',
  completed: 'badge-completed',
  cancelled: 'badge-cancelled',
};

const statusLabel = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  pending_completion: 'Awaiting Completion',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const paymentStatusColor = {
  pending:   { bg: 'rgba(234,179,8,0.12)',  border: 'rgba(234,179,8,0.3)',  text: '#fbbf24' },
  submitted: { bg: 'rgba(6,182,212,0.12)',  border: 'rgba(6,182,212,0.3)', text: '#67e8f9' },
  verified:  { bg: 'rgba(34,197,94,0.12)',  border: 'rgba(34,197,94,0.3)', text: '#4ade80' },
};

const SessionCard = ({
  session,
  currentUserId,
  onAccept,
  onReject,
  onChat,
  canLeaveReview,
  onLeaveReview,
  onMarkCompleted,
  onMarkCancelled,
  onSubmitPayment,
  onVerifyPayment,
}) => {
  const { user } = useAuth();
  const viewerId = currentUserId || user?._id;
  const isTeacher = session.teacher?._id === viewerId || session.teacher?._id?.toString() === viewerId;
  const other = isTeacher ? session.learner : session.teacher;

  const isPaymentVerified = session.paymentStatus === 'verified';
  const isPaymentSubmitted = session.paymentStatus === 'submitted';

  // Chat only available when payment verified
  const canChat = isPaymentVerified && ['confirmed', 'pending_completion', 'completed'].includes(session.status);
  const canReviewPendingBooking = isTeacher && session.status === 'pending';
  const canMarkCompletion = isTeacher && session.status === 'pending_completion';

  // Learner: can upload screenshot when confirmed and QR exists and payment not yet submitted/verified
  const canSubmitPayment =
    !isTeacher &&
    session.status === 'confirmed' &&
    session.paymentQR &&
    session.paymentStatus === 'pending';

  // Teacher: can verify payment when learner has submitted
  const canVerifyPayment = isTeacher && isPaymentSubmitted;

  const pmStyle = paymentStatusColor[session.paymentStatus] || paymentStatusColor.pending;

  return (
    <div className="glass card-hover" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{
            width: 44, height: 44, borderRadius: 10, overflow: 'hidden', flexShrink: 0,
            background: 'linear-gradient(135deg,#06b6d4,#7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <AvatarImage src={other?.avatar} alt={other?.name} size={44} iconSize={20} borderRadius={10} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>{isTeacher ? 'Student' : 'Teacher'}</p>
            <Link to={`/profile/${other?._id}`} style={{ textDecoration: 'none' }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem', color: '#f1f5f9' }}>{other?.name || '—'}</p>
            </Link>
          </div>
        </div>
        <span className={statusClass[session.status] || 'badge-pending'} style={{ flexShrink: 0 }}>
          {statusLabel[session.status] || session.status}
        </span>
      </div>

      {/* Skill */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Skill:</span>
        <span className="skill-tag">{session.skill}</span>
      </div>

      {/* Date / Time / Price */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', color: '#94a3b8' }}>
          <Calendar size={13} color="#06b6d4" />
          {session.date ? format(new Date(session.date), 'dd MMM yyyy') : '—'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', color: '#94a3b8' }}>
          <Clock size={13} color="#06b6d4" />
          {session.timeSlot || `${session.duration || 60} min`}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', color: '#94a3b8' }}>
          <IndianRupee size={13} color="#06b6d4" />
          {session.price?.toLocaleString('en-IN') || '—'}
        </div>
      </div>

      {session.notes && (
        <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b', fontStyle: 'italic',
          borderLeft: '2px solid rgba(6,182,212,0.3)', paddingLeft: '0.625rem' }}>
          {session.notes}
        </p>
      )}

      {/* Contact / Meeting Link */}
      {(session.contactNumber || session.meetingLink) && (
        <div style={{
          display: 'grid', gap: '0.5rem', padding: '0.875rem', borderRadius: 12,
          background: 'rgba(15,23,42,0.45)', border: '1px solid rgba(6,182,212,0.12)',
        }}>
          {session.contactNumber && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: '0.8rem' }}>
              <Phone size={13} color="#06b6d4" />
              <span>{session.contactNumber}</span>
            </div>
          )}
          {session.meetingLink && (
            <a href={session.meetingLink} target="_blank" rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#67e8f9', fontSize: '0.8rem', textDecoration: 'none' }}>
              <LinkIcon size={13} color="#06b6d4" />
              <span style={{ overflowWrap: 'anywhere' }}>{session.meetingLink}</span>
            </a>
          )}
        </div>
      )}

      {/* Payment QR (teacher's QR shown to learner when session confirmed) */}
      {!isTeacher && session.paymentQR && session.status === 'confirmed' && (
        <div style={{
          padding: '0.875rem', borderRadius: 12,
          background: 'rgba(15,23,42,0.45)', border: '1px solid rgba(234,179,8,0.2)',
        }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: 5 }}>
            <QrCode size={13} /> Scan QR to Pay
          </p>
          <img src={resolveImageUrl(session.paymentQR)} alt="Payment QR" style={{ width: '100%', maxWidth: 160, borderRadius: 8, display: 'block' }} />
        </div>
      )}

      {/* Payment Screenshot Preview (teacher sees submitted screenshot) */}
      {isTeacher && session.paymentScreenshot && isPaymentSubmitted && (
        <div style={{
          padding: '0.875rem', borderRadius: 12,
          background: 'rgba(15,23,42,0.45)', border: '1px solid rgba(6,182,212,0.2)',
        }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', color: '#67e8f9', display: 'flex', alignItems: 'center', gap: 5 }}>
            <Upload size={13} /> Learner's Payment Screenshot
          </p>
          <a href={resolveImageUrl(session.paymentScreenshot)} target="_blank" rel="noreferrer">
            <img src={resolveImageUrl(session.paymentScreenshot)} alt="Payment Screenshot" style={{ width: '100%', maxWidth: 200, borderRadius: 8, display: 'block' }} />
          </a>
        </div>
      )}

      {/* Payment status badge */}
      {session.status !== 'cancelled' && ['confirmed', 'pending_completion', 'completed'].includes(session.status) && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0.3rem 0.7rem',
          borderRadius: 8, fontSize: '0.72rem', fontWeight: 600,
          background: pmStyle.bg, border: `1px solid ${pmStyle.border}`, color: pmStyle.text,
          alignSelf: 'flex-start',
        }}>
          {session.paymentStatus === 'pending' && <><Hourglass size={11} /> Payment Pending</>}
          {session.paymentStatus === 'submitted' && <><Upload size={11} /> Payment Submitted</>}
          {session.paymentStatus === 'verified' && <><ShieldCheck size={11} /> Payment Verified</>}
        </div>
      )}

      {/* pending_completion notice */}
      {session.status === 'pending_completion' && isTeacher && (
        <div style={{
          padding: '0.625rem 0.875rem', borderRadius: 10,
          background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.25)',
          fontSize: '0.78rem', color: '#fbbf24',
        }}>
          ⏰ This session's scheduled time has passed. Please mark it as completed or cancel it.
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {/* Chat — only when payment verified */}
        {canChat && (
          <button className="btn-secondary" style={{ padding: '0.375rem 0.875rem', fontSize: '0.8rem' }}
            onClick={() => onChat && onChat(session)}>
            <MessageSquare size={13} /> Chat
          </button>
        )}

        {/* Chat locked indicator for confirmed sessions without verified payment */}
        {!isPaymentVerified && ['confirmed', 'pending_completion'].includes(session.status) && (
          <button className="btn-ghost" style={{ padding: '0.375rem 0.875rem', fontSize: '0.8rem', opacity: 0.5, cursor: 'not-allowed' }}
            disabled title="Chat available after payment is verified">
            <MessageSquare size={13} /> Chat (locked)
          </button>
        )}

        {/* Teacher: Accept / Reject pending */}
        {canReviewPendingBooking && (
          <>
            <button className="btn-primary" style={{ padding: '0.375rem 0.875rem' }}
              onClick={() => onAccept && onAccept(session._id)}>
              <CheckCircle2 size={13} /> Accept
            </button>
            <button className="btn-danger" style={{ padding: '0.375rem 0.875rem' }}
              onClick={() => onReject && onReject(session._id)}>
              <XCircle size={13} /> Reject
            </button>
          </>
        )}

        {/* Teacher: Verify / Reject payment screenshot */}
        {canVerifyPayment && (
          <>
            <button className="btn-primary" style={{ padding: '0.375rem 0.875rem', fontSize: '0.8rem' }}
              onClick={() => onVerifyPayment && onVerifyPayment(session._id, 'accept')}>
              <ShieldCheck size={13} /> Verify Payment
            </button>
            <button className="btn-danger" style={{ padding: '0.375rem 0.875rem', fontSize: '0.8rem' }}
              onClick={() => onVerifyPayment && onVerifyPayment(session._id, 'reject')}>
              <ShieldX size={13} /> Reject Payment
            </button>
          </>
        )}

        {/* Learner: Upload payment screenshot */}
        {canSubmitPayment && (
          <button className="btn-primary" style={{ padding: '0.375rem 0.875rem', fontSize: '0.8rem' }}
            onClick={() => onSubmitPayment && onSubmitPayment(session)}>
            <Upload size={13} /> Pay Now
          </button>
        )}

        {/* Teacher: Mark completed / cancel pending_completion */}
        {canMarkCompletion && (
          <>
            <button className="btn-primary" style={{ padding: '0.375rem 0.875rem', fontSize: '0.8rem' }}
              onClick={() => onMarkCompleted && onMarkCompleted(session._id)}>
              <CheckCircle2 size={13} /> Mark Completed
            </button>
            <button className="btn-danger" style={{ padding: '0.375rem 0.875rem', fontSize: '0.8rem' }}
              onClick={() => onMarkCancelled && onMarkCancelled(session._id)}>
              <XCircle size={13} /> Cancel Session
            </button>
          </>
        )}

        {/* Learner: Leave review (completed + payment verified) */}
        {canLeaveReview && (
          <button className="btn-primary" style={{ padding: '0.375rem 0.875rem' }}
            onClick={() => onLeaveReview && onLeaveReview(session)}>
            <Star size={13} /> Leave Review
          </button>
        )}
      </div>
    </div>
  );
};

export default SessionCard;
