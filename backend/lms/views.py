from rest_framework import viewsets
from .models import Lesson, Topic, Quiz, QuizAttempt, Question, Choice
from .serializers import LessonSerializer, TopicSerializer, QuizSerializer, QuizAttemptSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    filterset_fields = ['subject']

class TopicViewSet(viewsets.ModelViewSet):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    filterset_fields = ['lesson']

class QuizViewSet(viewsets.ModelViewSet):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    filterset_fields = ['lesson']

    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        quiz = self.get_object()
        answers = request.data.get('answers', {}) # Dict: {question_id: choice_id}
        score = 0
        total_questions = quiz.questions.count()

        for question_id, choice_id in answers.items():
            try:
                question = Question.objects.get(id=question_id, quiz=quiz)
                choice = Choice.objects.get(id=choice_id, question=question)
                if choice.is_correct:
                    score += 1
            except (Question.DoesNotExist, Choice.DoesNotExist):
                continue

        # Create Attempt Record
        # Assuming student is linked to user. If not, we might need a dummy student or passed ID.
        # For now, using a placeholder logic if request.user.student doesn't exist
        try:
            student = request.user.student
        except AttributeError:
             # Fallback for dev/testing without auth
            from students.models import Student
            student = Student.objects.first() 

        attempt = QuizAttempt.objects.create(
            student=student,
            quiz=quiz,
            score=score,
            total_questions=total_questions
        )

        return Response({
            'score': score,
            'total': total_questions,
            'attempt_id': attempt.id
        })

class QuizAttemptViewSet(viewsets.ModelViewSet):
    queryset = QuizAttempt.objects.all()
    serializer_class = QuizAttemptSerializer
    filterset_fields = ['student', 'quiz']
